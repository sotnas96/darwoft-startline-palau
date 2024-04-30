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
        try
        {
            const userId = req.customData.userId;
            const delPatientProfile = await PatientProfile.deleteOne({user: userId});
            const delUser = await User.deleteOne({_id: userId});
            return res.status(200).json({
                success: true, 
                delPatientProfile, 
                delUser});
        }
        catch(error)
        {
            res.status(400).json({success: false, error: error.message});
        }
    },
    getAppointments: async (req, res) => {
        try {
            // const appointments = await Schedule.find({});
            const appointments = {message: 'appointments'};
            res.status(200).json({success: true, appointments});

        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    allSchedules: async (req, res) => {
        try {
            //show only schedules that are available
            const schedules = await Schedule.find({ 'schedule.time_slot.available': true });
            res.status(200).json({success: true, schedules})
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    newAppointment: async (req, res) => {
        try {
            const appointObj = {
                doctor: req.body.doctor,
                patient: req.customData.userId,
                dueDate: req.body.date,
                time: req.body.time
            }
            //check if the user has no appointmets at that time
            const checkOverLap = await Appointment.findOne({ dueDate: appointObj.dueDate, time: appointObj.time});
            if (checkOverLap) throw new Error ('You cannot have more than 1(one) appointment at the same time on the same day');
           
            //create appointment
            const appointment = await Appointment.create(appointObj); 

            // find schedule info and updated base on the appointment;
            // $set operator allow us to modify a specific fields in a document
            // the $ operator refers to the matched element in the previous field schedule.$. referes to schedule array, time_slot.$[elem]. refers to the array element that match the array filter condition specified in array filter
            // array filter allow us to specify conditions for updating elements in a array based on criteria. we are telling to only update element where time match the chosen time
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: appointObj.doctor, 'schedule.date': appointObj.dueDate },
                { $set: { 'schedule.$.time_slot.$[elem].available': false, 'schedule.$.time_slot.$[elem].appointment': appointment._id } },
                { arrayFilters: [{ 'elem.time': appointObj.time }], new: true, useFindAndModify: false }    
            );
            res.status(200).json({success: true, appointment});

        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    deleteAppointment: async (req, res) => {
        //catch appointmet info
        //delete appointmet
        //update doctor schedule
        try {
            const appId = req.body.appointmentId;
            const appointment = await Appointment.findById(appId);
            const deleteAppoint = await Appointment.deleteOne({ _id: appointment._id });

            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: appointment.doctor, 'schedule.date': appointment.dueDate },
                { $set: { 'schedule.$.time_slot.$[elem].available': true, 'schedule.$.time_slot.$[elem].appointment': null } },
                { arrayFilters: [{ 'elem.appointment': new mongoose.Types.ObjectId(appointment._id) }], new: true, useFindAndModify: false }    
            );
            res.status(200).json({success: true, appointment, deleteAppoint, updateDoctorSchedule});
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    }
};
module.exports = patientController