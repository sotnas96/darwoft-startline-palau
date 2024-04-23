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
        Sex: String,
        social: String,
        career: String,
        dateBirth:
        {
            year: Number,
            month: Number,
            day: Number
        }
    }
);
profileSchema.virtual('dateFormat').get(function() {
    let dateFormat = `${this.day}/${this.month}/${this.year}`;
    return dateFormat;
});
module.exports = profileSchema