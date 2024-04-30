const {validationResult} = require('express-validator');
const { User, PatientProfile, DoctorProfile } = require("../dbconfig");
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/jwt');
const salt = parseInt(process.env.SALT)


const userController = {
    logIn: async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                    message: 'Validation result error'
                });
            }
            const userEmail = req.body.email;
            const user = await User.findOne({email: userEmail});
            const payload = {
                userId: user._id,
                email: user.email,
                fullName: user.fullname,
                role: user.role,
                version: 0,
            };
            const token = generateToken(payload);
            res.status(200).json({
                succes:true,
                token,
                payload
            });
        } catch(error){
            res.status(400).json({
                success: false,
                error:error.message
            });
        }
    },
    createUser: async (req, res) => {
        try {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                    message: 'Validation result error'
                });
            };
            const newUser = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, salt)
            };
            delete newUser.repassword;
            delete newUser.medicalKey;
            
            const user =  await new User(newUser).save();
            const newProfile = {user: user._id};
            let modelo = ( user.role === 'PATIENT') ?  PatientProfile : DoctorProfile;
            let profile = await new modelo(newProfile).save();
            return res.status(200).json({
                    success: true,
                    user,
                    profile
                });
        }
        catch(error) {
            return  res.status(400).json({
                    success: false, 
                    error: error.message,
                    messagge:'error from controller'
            });
        }
    }
};
module.exports = userController