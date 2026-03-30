const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

function isHabitablePlanet(planet) {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6
    );
}

async function savePlanet(planet) {
    try {
        await planets.updateOne(
            {
                kepler_name: planet.kepler_name,
            },
            {
                kepler_name: planet.kepler_name,
            },
            {
                upsert: true,
            },
        );
    } catch (error) {
        console.error(`Could not save planet: ${error}`);
    }
}

async function handleRow(planet) {
    if (isHabitablePlanet(planet)) {
        savePlanet(planet);
    }
}

async function loadPlanetsData() {
    const readStream = fs.createReadStream(
        path.join(__dirname, "..", "..", "data", "kepler_data.csv"),
    );
    const parser = parse({
        comment: "#",
        columns: true,
    });

    const parserPipeline = readStream.pipe(parser);
    try {
        for await (const planet of parserPipeline) {
            await handleRow(planet);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getAllPlanets() {
    return await planets.find({});
}

module.exports = { loadPlanetsData, getAllPlanets };
