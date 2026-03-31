const mongoose = require("mongoose");

const MONGO_URL =
    "mongodb+srv://eelopez515:Iris0428!!@cluster0.vnbhwha.mongodb.net/nasa?appName=nasa-project";

mongoose.connection.once("open", () => {
    console.log("MongoDB connection ready!!");
});

mongoose.connection.on("error", (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
