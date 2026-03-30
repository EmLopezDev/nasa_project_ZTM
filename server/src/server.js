const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const { loadPlanetsData } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
    "mongodb+srv://eelopez515:Iris0428!!@cluster0.vnbhwha.mongodb.net/?appName=nasa-project";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!!");
});

mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`);
    });
}

startServer();
