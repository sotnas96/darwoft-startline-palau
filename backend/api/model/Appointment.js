const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    date: {
        type: Date,
        set: (value) => {
           return new Date(value).setUTCHours(0, 0, 0, 0);
        }
    },
    time: String
});
module.exports = appointmentSchema;