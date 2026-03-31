const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const BASE_LAUNCHES_URL = "/v1/launches";

describe("Launches API", () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe("Test GET /v1/launches", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get(BASE_LAUNCHES_URL)
                .expect("Content-Type", "application/json; charset=utf-8")
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

    describe("Test POST /v1/launches", () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            destination: "Kepler-296 A f",
            launchDate: "January 4, 2028",
        };
        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            destination: "Kepler-296 A f",
        };

        const launchDataWithInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            destination: "Kepler-296 A f",
            launchDate: "hello",
        };

        const launchDataWithInvalidDestination = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            destination: "Earth",
            launchDate: "January 4, 2028",
        };
        test("It should respond with 201 created", async () => {
            const response = await request(app)
                .post(BASE_LAUNCHES_URL)
                .send(completeLaunchData)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(201);

            const requestDate = new Date(
                completeLaunchData.launchDate,
            ).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(response.body).toMatchObject(launchDataWithoutDate);
            expect(responseDate).toBe(requestDate);
        });

        test("It should catch missing required properties", async () => {
            const response = await request(app)
                .post(BASE_LAUNCHES_URL)
                .send(launchDataWithoutDate)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Missing required launch property",
            });
        });
        test("It should catch invalid dates", async () => {
            const response = await request(app)
                .post(BASE_LAUNCHES_URL)
                .send(launchDataWithInvalidDate)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400);

            expect(response.body).toStrictEqual({
                error: "Invalid launch date",
            });
        });

        test("It should catch invalid planet", async () => {
            const response = await request(app)
                .post(BASE_LAUNCHES_URL)
                .send(launchDataWithInvalidDestination)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400);
            expect(response.body).toStrictEqual({
                error: "No matching planet was found",
            });
        });
    });
});
