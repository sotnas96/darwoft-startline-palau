const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorProfileSchema = new Schema(
    {
        user:
        {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        area:
        {
            type: Schema.Types.ObjectId,
            ref:'MedicalArea',
        },
        medicalLicense: String,
        dni: Number,
        sex: String,
        dateBirth:
        {
            year: Number,
            month: Number,
            day: Number
        },
        avatar: String
    }
);
module.exports = doctorProfileSchema;