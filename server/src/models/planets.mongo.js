const { Schema, model } = require("mongoose");

const planetsSchema = new Schema({
    kepler_name: {
        type: String,
        required: true,
    },
});

module.exports = model("Planet", planetsSchema);
