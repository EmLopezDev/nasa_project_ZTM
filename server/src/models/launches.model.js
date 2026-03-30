// const launches = require("./launches.mongo");
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    destination: "Kepler-442 b",
    customers: ["NASA", "ZTM"],
    upcoming: true,
    success: true,
};

launches.set(launch.flightNumber, launch);

function getLaunchById(launchId) {
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

function postNewLaunch(launch) {
    latestFlightNumber++;
    const updatedLaunch = Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ["Zero To Mastery", "NASA"],
        upcoming: true,
        success: true,
    });
    launches.set(latestFlightNumber, updatedLaunch);
}

function deleteLaunch(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    getLaunchById,
    getAllLaunches,
    postNewLaunch,
    deleteLaunch,
};
