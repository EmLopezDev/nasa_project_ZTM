const request = require("supertest");
const app = require("../../app");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Test GET /planets", () => {
    beforeAll(async () => {
        await loadPlanetsData();
    });
    test("It should respond with 200 success", async () => {
        const response = await request(app)
            .get("/planets")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200);

        expect(response.body.length).toBe(8);
    });
});
