const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorProfileSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref:'user',
        },
        area: {
            type: Schema.Types.ObjectId,
            ref:'medical_area',
        },
        medicalLicense: Number,
        dni: Number,
        sex: String,
        dateBirth: String,
        avatar: String
    }
);
module.exports = doctorProfileSchema;