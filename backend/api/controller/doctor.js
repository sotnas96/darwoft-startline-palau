const { validationResult } = require('express-validator');
const { User, DoctorProfile, Schedule, Appointment } = require("../dbconfig");
const  mongoose  = require('mongoose');

const getDates = require("../utils/doctorSchedule");

exports.getMedicAreas = async () => {
    try {
        return await MedicalArea.find({});
    } catch(error) {
        res.status(400).json({error: error.message});
    }

};
const getAreaId = async (value) => {
    const areas = await getMedicAreas();
    const medicArea = areas.find((obj) => obj['area'] === value);
    return medicArea.id;
}


const doctorController = {
    getProfile: async (req, res) => {
        try {
            let payload = req.customData
            let doctorProfile = await DoctorProfile.findOne({user: payload.userId});
            if (!doctorProfile) throw new Error('Invalid user');
            res.status(200).json({success: true, payload, doctorProfile}); 

        } catch(error){   
            res.status(400).json({success: false, error: error.message});
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.file) throw new Error('Please upload a .jpg, .png or .jpeg file');
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({success:false, errors: errors.array()});
            }
            const areaId = await getAreaId(req.body.area);

            let doctorProfile = {
                ...req.body,
                area: areaId,
                avatar: req.file.path
            };
            const profileUpdate = await DoctorProfile.findOneAndUpdate(
                { _id: req.customData.profile },
                doctorProfile,
                { returnOriginal: false }
            );
            return res.status(200).json({
                        success: true, 
                        message: 'doctor updated', 
                        profileUpdate
            });
        } catch(error) {
            res.status(400).json({
                success: false, 
                error: error.message, 
                message: 'doctor controller update failed'
            });
        }
    },
    deleteProfile: async (req, res) => {
        try {
            const userId = req.customData.userId;
            const delDocProfile = await DoctorProfile.deleteOne({user: userId});
            const delUser = await User.deleteOne({_id: userId});
            return res.status(200).json({
                success: true, 
                delDocProfile, 
                delUser
            });
        } catch(error) {
            res.status(400).json({
                success: false, 
                error: error.message
            });
        }
    },
    getAppointments: async (req, res) => {
        try {
            const getAppointments = await Appointment.find({doctor: req.customData.userId});
            return res.status(200).json({success: true, getAppointments});
        } catch (error) {
            res.status(400).json({success: false, error: error.message});
        }
    },
    uploadSchedule: async (req, res) => {
        try {
            //validate date 
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({success: false, error: error.array()});
            }
            const scheduleQuery = { doctor: req.customData.userId }
            const userDate = new Date(req.body.date);

            if (userDate < new Date()) throw new Error('Cannot uploaded a past dates. Choose a later one');

            const checkDate = await Schedule.findOne({ doctor: req.customData.userId, 'schedule.date': userDate });
            if (checkDate) throw new Error ('Chosen date is already uploaded');

            const validDates = getDates(userDate);
            const scheduleUpdate = { $push: { schedule: { $each: validDates }}};
            const scheduleOptions = { new: true, upsert: true, useFindAndModify: false };
            const scheduleDocs = await Schedule.findOneAndUpdate(scheduleQuery, scheduleUpdate, scheduleOptions);
            return res.status(200).json(scheduleDocs);
        } catch (error) {
            res.status(400).json({ success: false, error: error.message })
        }
    },
    cancelAppointmet: async (req, res) => {
        try {
            const appId = req.body.appointment;
            const canceledAppointment = await Appointment.findOneAndDelete({_id: appId});
            if (!canceledAppointment) throw new Error ("Failed to cancel appointment");
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: canceledAppointment.doctor, 'schedule.date': canceledAppointment.date },
                { $set: { 'schedule.$.time_slot.$[elem].available': true, 'schedule.$.time_slot.$[elem].appointment': null } },
                { arrayFilters: [{ 'elem.appointment': new mongoose.Types.ObjectId(canceledAppointment._id) }], new: true, useFindAndModify: false }    
            );
            if (!updateDoctorSchedule) throw new Error ("Failed to update schedule");
            res.status(200).json({success: true, canceledAppointment});
        } catch (error) {
            res.status(400).json({success: false, error: error.message})
        }
    }
};
module.exports = doctorController