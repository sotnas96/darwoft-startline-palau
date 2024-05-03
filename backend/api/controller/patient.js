const {validationResult} = require('express-validator');
const { User, PatientProfile, Appointment, Schedule } = require("../dbconfig");
const  mongoose  = require('mongoose');

const patientController = {
    getProfile: async (req, res) => {
        try {
            let payload = req.customData
            let patientProfile = await PatientProfile.findOne({user:payload.userId});
            res.status(200).json({success:true, payload, patientProfile}); 

        } catch(error) {   
            res.status(400).json({success:false, error});
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.file) throw new Error('Please upload a .jpg, .png or .jpeg file');
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({success:false, errors: errors.array()});
            }
            let userId = {user: req.customData.userId};
            let patientProfile = {...req.body};
            const profileUpdate = await PatientProfile.findOneAndUpdate(
                userId,
                patientProfile,
                {
                    returnOriginal: false
                }
            );
            res.status(200).json({success:true, message:'patient updated', profileUpdate});

        } catch(error) {
            res.status(400).json({success:false, error: error.message});
        }
    },
    deleteProfile: async (req, res) =>
    {
        try {
            const userId = req.customData.userId;
            const delPatientProfile = await PatientProfile.deleteOne({user: userId});
            const delUser = await User.deleteOne({_id: userId});
            return res.status(200).json({
                success: true, 
                delPatientProfile, 
                delUser
            });
        } catch(error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    getAppointments: async (req, res) => {
        try {
            const appointments = await Appointment.find({patient: req.customData.userId}); 
            res.status(200).json({success: true, appointments});

        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    allSchedules: async (req, res) => {
        try {
            const schedule = await Schedule.find({'schedule.time_slot': { $elemMatch: { available: true }}})
            res.status(200).json({success: true, schedule});
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    newAppointment: async (req, res) => {
        try {
            const results = validationResult(req);
            if (!results.isEmpty()) return res.status(400).json({success: false, errors: results.array()});

            const appointment = {
                ...req.body,
                patient: req.customData.userId
            }
            const checkOverLap = await Appointment.findOne({
                patient: appointment.patient, 
                date: appointment.date, 
                time: appointment.time
            });
            if (checkOverLap) throw new Error ('You cannot have more than 1(one) appointment at the same time on the same day');
            
            const isBooked = await Schedule.findOne({
                doctor: appointment.doctor, 
                'schedule.date': appointment.date, 
                'schedule.time_slot': { $elemMatch: { time: appointment.time, available: false }}
            });

            if (isBooked) throw new Error ('Appointment already booked, try another date/time');
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
            if (!updateDoctorSchedule) throw new Error('doctor schedule is not updated');
            
            res.status(200).json({success: true, newAppointment, data: updateDoctorSchedule});

        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    deleteAppointment: async (req, res) => {
        try {
            const appId = req.body.appointmentId;
            const deleteAppoint = await Appointment.findOneAndDelete({ _id: appId, patient: req.customData.userId });
            if (!deleteAppoint) throw new Error('Appointment deletion failed');
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: deleteAppoint.doctor, 'schedule.date': deleteAppoint.date },
                { $set: { 'schedule.$.time_slot.$[elem].available': true, 'schedule.$.time_slot.$[elem].appointment': null } },
                { arrayFilters: [{ 'elem.appointment': new mongoose.Types.ObjectId(deleteAppoint._id) }], new: true, useFindAndModify: false }    
            );
            res.status(200).json({success: true, deleteAppoint, updateDoctorSchedule});
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    }
};
module.exports = patientController