const mongoose = require("mongoose");
const { Schema } = mongoose;

const medicalAreaSchema = new Schema(
    {
        area:
        {
            type: String,
            require: true,
        }
    }
);
module.exports = medicalAreaSchema;