const { validationResult } = require('express-validator');
const { User, DoctorProfile, Schedule } = require("../dbconfig");
const getMedicAreas = require("../utils/getMedicAreas"); 
const getSchedule = require("../utils/doctorSchedule");
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
            let userId = {user: req.customData.userId};
            const areaId = await getAreaId(req.body.area);
            let doctorProfile = {
                ...req.body,
                area: areaId
            };
            const profileUpdate = await DoctorProfile.findOneAndUpdate(
                userId,
                doctorProfile,
                { returnOriginal: false }
            );
            res.status(200).json({
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
    getAppointments: (req, res) => {
        return res.json("doctor Appointments")
    },
    uploadSchedule: async (req, res) => {
        try {
            const result = validationResult(req);
            if (! result.isEmpty()) return res.status(400).json({ success:false, errors: result.array() });
           
            const doctorId = req.customData.userId;
            const schedule = await getSchedule(req.body.startDate, req.body.endDate, req.customData.userId);
            if (schedule.valid.length == 0) throw new Error('Choose valid dates')
            
            if (!schedule.userScheduleExist) {
                await Schedule.create({doctor: doctorId, schedule: schedule.valid})
            } else {
                await Schedule.findOneAndUpdate( 
                    { doctor: doctorId },
                    { $push: { schedule: { $each: schedule.valid}}},
                    { new: true, upsert: true, useFindAndModify: false }
                ) 
            }
            res.status(200).json({succes: true, schedule})
        } catch(error) {
            res.status(400).json({success:false, error: error.message})
        }
    }
};
module.exports = doctorController