const { validationResult } = require('express-validator');
const { User, DoctorProfile, Schedule, Appointment } = require("../dbconfig");
const  mongoose  = require('mongoose');
const CustomError = require("../utils/CustomError");

const getMedicAreas = async () => {
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
const getValidDates = startDate => {
    const getTime_slot = () => {
        const time_slot = [];
        for (i = 8; i <= 13; i++) {
            time_slot.push({ time: `${i}:00`});
        }   
        return time_slot; 
    }
    const validDates = []
    const current = new Date(startDate);
 
    while (current.getUTCMonth() == startDate.getUTCMonth()) {
        if (current.getUTCDay() != 0 && current.getUTCDay() != 6) {
            validDates.push({
                date: new Date(current),
                time_slot: getTime_slot(),
            })
        }
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return validDates
}

const doctorController = {
    getProfile: async (req, res) => {
        try {
            let doctorProfile = await User.findOne({_id:req.customData.userId}).populate('profile');
            if (!doctorProfile) throw new CustomError('Doctor not found', 400);
            res.status(200).json({success:true, profile: doctorProfile.profile}); 

        } catch(error){   
            res.status(error.statusCode).json({success: false, error: error.message});
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.file) throw new CustomError('Please upload a .jpg, .png or .jpeg file', 400);
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new CustomError('Update failed', 400, errors.array() )
            const areaId = await getAreaId(req.body.area);
            let doctorProfile = {
                ...req.body,
                area: areaId,
                avatar: req.file.path,
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
            res.status(error.statusCode).json({
                success: false, 
                message: error.message, 
                error: error.getErrors()
            });
        }
    },
    deleteProfile: async (req, res) => {
        try {
            const delDocProfile = await DoctorProfile.deleteOne({user: req.customData.profile});
            const delUser = await User.deleteOne({_id: req.customData.userId});
            return res.status(200).json({
                success: true, 
                delDocProfile, 
                delUser
            });
        } catch(error) {
            res.status(error.statusCode).json({
                success: false, 
                error: error.message
            });
        }
    },
    getAppointments: async (req, res) => {
        try {
            const getAppointments = await Appointment.find({doctor: req.customData.userId});
            if (!getAppointments) throw new CustomError('appointments not found', 400)
            return res.status(200).json({success: true, getAppointments});
        } catch (error) {
            res.status(error.statusCode).json({success: false, error: error.message});
        }
    },
    uploadSchedule: async (req, res) => {
        //validate date 
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const customError = new CustomError('Update failed', 400, error.array())
            return res.status(customError.statusCode).json({success: false, error: customError.getErrors()});
        }
        try {
            const scheduleQuery = { doctor: req.customData.userId }
            const userDate = new Date(req.body.date);

            if (userDate < new Date()) throw new CustomError('Cannot uploaded a past dates. Choose a later one', 400);

            const checkDate = await Schedule.findOne({ doctor: req.customData.userId, 'schedule.date': userDate });
            if (checkDate) throw new CustomError ('Chosen date is already uploaded', 400);

            const validDates = getValidDates(userDate);
            const scheduleUpdate = { $push: { schedule: { $each: validDates }}};
            const scheduleOptions = { new: true, upsert: true, useFindAndModify: false };
            const scheduleDocs = await Schedule.findOneAndUpdate(scheduleQuery, scheduleUpdate, scheduleOptions);
            return res.status(200).json(scheduleDocs);
        } catch (error) {
            res.status(error.statusCode).json({ success: false, error: error.message })
        }
    },
    cancelAppointmet: async (req, res) => {
        try {
            const appId = req.body.appointment;
            const canceledAppointment = await Appointment.findOneAndDelete({_id: appId});
            if (!canceledAppointment) throw new CustomError ("Failed to cancel appointment", 400);
            const updateDoctorSchedule = await Schedule.findOneAndUpdate(
                { doctor: canceledAppointment.doctor, 'schedule.date': canceledAppointment.date },
                { $set: { 'schedule.$.time_slot.$[elem].available': true, 'schedule.$.time_slot.$[elem].appointment': null } },
                { arrayFilters: [{ 'elem.appointment': new mongoose.Types.ObjectId(canceledAppointment._id) }], new: true, useFindAndModify: false }    
            );
            if (!updateDoctorSchedule) throw new CustomError ("Failed to update schedule", 400);
            res.status(200).json({success: true, canceledAppointment});
        } catch (error) {
            res.status(error.statusCode).json({success: false, error: error.message})
        }
    }
};
module.exports = doctorController