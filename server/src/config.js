require("dotenv").config();

const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MONGO_URL: process.env.MONGO_URL,
    COOKIE_NAME: process.env.COOKIE_NAME,
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2,
    COOKIE_MAX_AGE: process.env.COOKIE_MAX_AGE,
};

module.exports = config;
