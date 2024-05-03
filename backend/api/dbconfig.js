const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
 
const userSchema  = require("./model/User");
const patientProfileSchema = require("./model/PatientProfile");
const doctorProfileSchema = require('./model/DoctorProfile');
const medicalAreaSchema = require('./model/MedicalArea');
const appointmentSchema = require("./model/Appointment");
const availabilitySchema = require("./model/Availability");

const connectionString = process.env.MONGODB_URI;
 
const User = mongoose.model('user', userSchema);
const PatientProfile = mongoose.model('patient_profile', patientProfileSchema);
const DoctorProfile = mongoose.model('doctor_profile', doctorProfileSchema);
const MedicalArea = mongoose.model('medical_area', medicalAreaSchema);
const Appointment = mongoose.model('appointment', appointmentSchema);
const Schedule = mongoose.model('schedule', availabilitySchema);

const connectionToDB = async () =>
{
    try 
    {
        await mongoose.connect(connectionString, 
            {
                autoIndex: true
            });
        console.log('connected to Mongo db atlas');
    }
    catch(error)
    {
        console.error(error);
    }
};
module.exports = 
{
    User,
    PatientProfile,
    DoctorProfile,
    MedicalArea,
    Appointment,
    Schedule,
    connectionToDB,
};