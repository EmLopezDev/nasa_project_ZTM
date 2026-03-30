const { Schema } = require("mongoose");

const planetsSchema = new Schema({
    kepler_name: {
        type: String,
        required: true,
    },
});
