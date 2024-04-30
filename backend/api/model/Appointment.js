const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    dueDate: Date,
    time: String
});
module.exports = appointmentSchema;