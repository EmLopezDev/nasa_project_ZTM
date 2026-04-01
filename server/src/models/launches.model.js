const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunchData() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1,
                    },
                },
                { path: "payloads", select: { customers: 1 } },
            ],
        },
    });

    if (response.status !== 200) {
        console.error("Problem downloading launch data from SpaceX");
        throw new Error("Launch data download from SpaceX failed");
    }

    const launchDocsData = response.data.docs;

    for (const launchDoc of launchDocsData) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload) => {
            return payload.customers;
        });
        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: new Date(launchDoc.date_local),
            customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
        };

        console.log(`${launch.flightNumber}: ${launch.mission}`);

        await saveLaunch(launch);
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({ flightNumber: 1 });
    if (firstLaunch) {
        console.log(`${firstLaunch} exists`);
    } else {
        await populateLaunchData();
    }
}

async function saveLaunch(launch) {
    if (isNaN(launch.launchDate)) {
        throw new Error("Invalid launch date");
    }

    await launches.findOneAndUpdate(
        {
            flightNumber: launch.flightNumber,
        },
        launch,
        { upsert: true },
    );
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function getLaunchById(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort("-flightNumber");
    if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launches
        .find({}, { _id: 0, __v: 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function postNewLaunch(launch) {
    const planet = await planets.findOne({ kepler_name: launch.destination });

    if (!planet) {
        throw new Error("No matching planet was found");
    }
    const newFlightNumber = (await getLatestFlightNumber()) + 1;
    const newLaunch = Object.assign(launch, {
        launchDate: new Date(launch.launchDate),
        customers: ["Zero To Mastery", "NASA"],
        flightNumber: newFlightNumber,
        upcoming: true,
    });

    await saveLaunch(newLaunch);
}

async function deleteLaunch(launchId) {
    const deleted = await launches.updateOne(
        { flightNumber: launchId },
        { upcoming: false, success: false },
    );

    return deleted.matchedCount === 1;
}

module.exports = {
    loadLaunchesData,
    getLaunchById,
    getAllLaunches,
    postNewLaunch,
    deleteLaunch,
};
