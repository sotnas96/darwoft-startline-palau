const dotenv = require("dotenv");
const mongoose = require("mongoose");
 
const userSchema  = require("./model/User");
const patientProfileSchema = require("./model/PatientProfile");
const doctorProfileSchema = require('./model/DoctorProfile');
const medicalAreaSchema = require('./model/MedicalArea');

dotenv.config();
const connectionString = process.env.MONGODB_URI;
 
const User = mongoose.model('user', userSchema);
const PatientProfile = mongoose.model('patient_profile', patientProfileSchema);
const DoctorProfile = mongoose.model('doctor_profile', doctorProfileSchema);
const MedicalArea = mongoose.model('medical_area', medicalAreaSchema);

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
    connectionToDB,

};