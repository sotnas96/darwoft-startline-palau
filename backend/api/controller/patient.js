const {validationResult} = require('express-validator');
const { User, PatientProfile } = require("../dbconfig");

const patientController =
{
    getProfile: async (req, res) =>
    {
        try
        {
            let payload = req.customData
            let patientProfile = await PatientProfile.findOne({user:payload.userId});
            res.status(200).json({success:true, payload, patientProfile}); 
        }
        catch(error)
        {   
            res.status(400).json({success:false, error});
        }
    },
    updateProfile: async (req, res) =>
    {
        try
        {
            let errors = validationResult(req);
            if (!errors.isEmpty())  throw new Error({success:false, errors: errors.array()});
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
        }
        catch(error)
        {
            res.status(400).json({success:false, error, message:'patient controller update failed'});
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
            res.status(400).json({success: false, error});
        }
    }
};
module.exports = patientController