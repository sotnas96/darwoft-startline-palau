const mongoose = require("mongoose");
const { Schema } = mongoose;
const timeSlotSchema = new Schema({
    time: String,
    available: {
        type: Boolean,
        default: true
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null
    }
});
const availalabilitySlotSchema = new Schema({
    date: {
        type: Date,
        set: (value) => {
           return new Date(value).setUTCHours(0, 0, 0, 0);
        }
    },
    time_slot: [timeSlotSchema]
})
const availabilitySchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    schedule: [availalabilitySlotSchema]
});
module.exports = availabilitySchema;