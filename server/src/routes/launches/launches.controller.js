const {
    getLaunchById,
    getAllLaunches,
    postNewLaunch,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpPostNewLaunch(req, res) {
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
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: "Invalid launch date" });
    }
    postNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpDeleteLaunch(req, res) {
    const launchId = req.params.id;

    if (!getLaunchById(launchId)) {
        return res.status(404).json({ error: "Launch not found" });
    }

    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpPostNewLaunch,
    httpDeleteLaunch,
};
