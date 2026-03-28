const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body[0]).toStrictEqual({
            flightNumber: 100,
            mission: "Kepler Exploration X",
            rocket: "Explorer IS1",
            launchDate: new Date("December 27, 2030").toISOString(),
            destination: "Kepler-442 b",
            customers: ["NASA", "ZTM"],
            upcoming: true,
            success: true,
        });
    });
});

describe("Test POST /launches", () => {
    const completeLaunchData = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        destination: "Kepler-186 f",
        launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        destination: "Kepler-186 f",
    };

    const launchDataWithInvalidDate = {
        mission: "USS Enterprise",
        rocket: "NCC 1701-D",
        destination: "Kepler-186 f",
        launchDate: "hello",
    };
    test("It should respond with 201 created", async () => {
        const response = await request(app)
            .post("/launches")
            .send(completeLaunchData)
            .expect("Content-Type", /json/)
            .expect(201);

        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();

        expect(response.body).toMatchObject(launchDataWithoutDate);
        expect(responseDate).toBe(requestDate);
    });

    test("It should catch missing required properties", async () => {
        const response = await request(app)
            .post("/launches")
            .send(launchDataWithoutDate)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Missing required launch property",
        });
    });
    test("It should catch invalid dates", async () => {
        const response = await request(app)
            .post("/launches")
            .send(launchDataWithInvalidDate)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
});
