const mongoose = require("mongoose");
const { Schema } = mongoose;

const PatientProfileSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref:'user',
        },
        dni: Number,
        sex: String,
        healthCare: String,
        career: String,
        dateBirth: String,
        avatar: String
    }
);
PatientProfileSchema.virtual('dateFormat').get(function() {
    let dateFormat = `${this.day}/${this.month}/${this.year}`;
    return dateFormat;
});
module.exports = PatientProfileSchema