// const {validationResult} = require('express-validator');
const { User, DoctorProfile } = require("../dbconfig");

const doctorController =
{
    getProfile: async (req, res) =>
    {
        try
        {
            let payload = req.customData
            let doctorProfile = await DoctorProfile.findOne({user: payload.userId});
            res.status(200).json({success: true, payload, doctorProfile}); 
        }
        catch(error)
        {   
            res.status(400).json({success: false, error});
        }
    },
    updateProfile: async (req, res) =>
    {
        try
        {
            //------------------------------------------------  doctor update validations missing -----------------------------
            // let errors = validationResult(req);
            // if (!errors.isEmpty())  throw new Error({success:false, errors: errors.array()});
            let userId = {user: req.customData.userId};
            let doctorProfile = {...req.body};
            const profileUpdate = await DoctorProfile.findOneAndUpdate(
                userId,
                doctorProfile,
                {
                    returnOriginal: false
                }
            );
            res.status(200).json({success: true, message: 'doctor updated', profileUpdate});
        }
        catch(error)
        {
            res.status(400).json({success: false, error, message: 'doctor controller update failed'});
        }
    },
    deleteProfile: async (req, res) =>
    {
        try
        {
            const userId = req.customData.userId;
            const delDocProfile = await DoctorProfile.deleteOne({user: userId});
            const delUser = await User.deleteOne({_id: userId});
            return res.status(200).json({
                success: true, 
                delDocProfile, 
                delUser});
        }
        catch(error)
        {
            res.status(400).json({success: false, error});
        }
    }
};
module.exports = doctorController