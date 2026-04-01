const {
    getLaunchById,
    getAllLaunches,
    postNewLaunch,
    deleteLaunch,
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
    const { limit, skip } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpPostNewLaunch(req, res) {
    const launch = req.body;
    if (
        !launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.destination
    ) {
        return res
            .status(400)
            .json({ error: "Missing required launch property" });
    }

    try {
        await postNewLaunch(launch);
        return res.status(201).json(launch);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

async function httpDeleteLaunch(req, res) {
    const launchId = Number(req.params.id);
    const launchExists = await getLaunchById(launchId);
    if (!launchExists) {
        return res.status(404).json({ error: "Launch not found" });
    }
    const isAborted = await deleteLaunch(launchId);

    if (!isAborted) {
        return res.status(400).json({ error: "Unable to abort launch" });
    }

    return res.status(200).json({ deleted: isAborted });
}

module.exports = {
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpDeleteLaunch,
};
