const {validationResult} = require('express-validator');
const { User, PatientProfile, Appointment, Schedule } = require("../dbconfig");
const  mongoose  = require('mongoose');
const CustomError = require('../utils/CustomError');
const userCrud = require("../utils/userCrud");

const patientController = {
    getProfile: async (req, res) => {
        try {
            let patientProfile = await User.findOne({ _id: req.customData.userId}).populate('profile');
            if (!patientProfile) throw new CustomError('Patient not found', 400);
            res.status(200).json({success:true, profile: patientProfile.profile}); 

        } catch(error) {   
            res.status(error.statusCode).json({success:false, message: error.message});
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.file) throw new CustomError('Please upload a .jpg, .png or .jpeg file', 400);
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new CustomError('Update validation failed', 400, errors.array());
            let patientProfile = {
                ...req.body,
                avatar: req.file.path
            };
            const profileUpdate = await PatientProfile.findOneAndUpdate(
                { _id: req.customData.profile },
                patientProfile,
                { returnOriginal: false }
            );
            if (!profileUpdate) throw new CustomError('update failed', 400)
            res.status(200).json({success:true, message:'patient updated', profileUpdate});

        } catch(error) {
            res.status(error.statusCode).json({success:false, error: error.getErrors()});
        }
    },
    deleteProfile: async (req, res) => {
        try {
            const delPatientProfile = await PatientProfile.deleteOne({_id: req.customData.profile});
            const delUser = await User.deleteOne({_id: req.customData.userId});
            return res.status(200).json({
                success: true, 
                delPatientProfile, 
                delUser
            });
        } catch(error) {
            res.status(statusCode).json({success: false, error: error.message});
        }
    },
    getAppointments: async (req, res) => {
        try {
            const appointments = await Appointment.find({patient: req.customData.userId}).populate('doctor'); 
            res.status(200).json({success: true, appointments});
    
        } catch (error) {
            res.status(statusCode).json({success: false, error: error.message});
        }
    },
    allSchedules: async (req, res) => {
        try {
            const schedule = await Schedule.find({'schedule.time_slot': { $elemMatch: { available: true }}}).populate({path: 'doctor', select:'name lastName'})
            res.status(200).json({success: true, schedule});
        } catch (error) {
            res.status(statusCode).json({success: false, error: error.message});
        }
    },
    newAppointment: async (req, res) => {
        const results = validationResult(req);
        if (!results.isEmpty()) {
            const error = new CustomError('Appointment validation failed', 400, results.array())
            return res.status(400).json({success: false, errors: error.getErrors()});
        }
        try {

            const appointment = {
                ...req.body,
                patient: req.customData.userId
            }
            const checkOverLap = await Appointment.findOne({
                patient: appointment.patient, 
                date: appointment.date, 
                time: appointment.time
            });
            if (checkOverLap) throw new CustomError ('You cannot have more than 1(one) appointment at the same time on the same day', 400);
            
            const isBooked = await Schedule.findOne({
                doctor: appointment.doctor, 
                'schedule.date': appointment.date, 
                'schedule.time_slot': { $elemMatch: { time: appointment.time, available: false }}
            });

            if (isBooked) throw new CustomError ('Appointment already booked, try another date/time', 400);
            const newAppointment = await  Appointment.create(appointment); 

            // find schedule info and updated on the specific appointment;
            // $set operator allow us to modify a specific fields in a document
            // the $ operator refers to the matched element in the previous field schedule.$. referes to schedule array, time_slot.$[elem]. refers to the array element that match the array filter condition specified in array filter
            // array filter allow us to specify conditions for updating elements in a array based on criteria. we are telling to only update element where time match the chosen time
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: appointment.doctor, 'schedule.date': appointment.date },
                { $set: { 'schedule.$.time_slot.$[elem].available': false, 'schedule.$.time_slot.$[elem].appointment': newAppointment._id }},
                { arrayFilters: [{ 'elem.time': appointment.time }], new: true, useFindAndModify: false } 
            );
            if (!updateDoctorSchedule) throw new CustomError('doctor schedule is not updated', 400);
            
            res.status(200).json({success: true, newAppointment, data: updateDoctorSchedule});

        } catch (error) {
            res.status(error.statusCode).json({error: error.message});
        }
    },
    deleteAppointment: async (req, res) => {
        try {
            const appId = req.body.appointmentId;
            const deleteAppoint = await Appointment.findOneAndDelete({ _id: appId, patient: req.customData.userId });
            if (!deleteAppoint) throw new CustomError('Appointment deletion failed', 400);
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: deleteAppoint.doctor, 'schedule.date': deleteAppoint.date },
                { $set: { 'schedule.$.time_slot.$[elem].available': true, 'schedule.$.time_slot.$[elem].appointment': null } },
                { arrayFilters: [{ 'elem.appointment': new mongoose.Types.ObjectId(deleteAppoint._id) }], new: true, useFindAndModify: false }    
            );
            res.status(200).json({success: true, deleteAppoint, updateDoctorSchedule});
        } catch (error) {
            res.status(error.statusCode).json({success: false, error: error.message});
        }
    }
};
module.exports = patientController