const mongoose = require("mongoose");
const { Schema } = mongoose;

const profileSchema = new Schema(
    {
        user:
        {
            type: Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        dni: Number,
        sex: String,
        healthCare: String,
        career: String,
        dateBirth:
        {
            year: Number,
            month: Number,
            day: Number
        },
        avatar: String
    }
);
profileSchema.virtual('dateFormat').get(function() {
    let dateFormat = `${this.day}/${this.month}/${this.year}`;
    return dateFormat;
});
module.exports = profileSchema