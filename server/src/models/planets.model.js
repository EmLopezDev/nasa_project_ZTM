const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6
    );
}

async function handleRow(row) {
    if (isHabitablePlanet(row)) {
        habitablePlanets.push(row);
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
        for await (const row of parserPipeline) {
            await handleRow(row);
        }
        console.log(`${habitablePlanets.length} habitable planets found!`);
    } catch (error) {
        console.error(error);
    }
}

function getAllPlanets() {
    return habitablePlanets;
}

module.exports = { loadPlanetsData, getAllPlanets };
