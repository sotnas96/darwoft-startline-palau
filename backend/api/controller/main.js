const {validationResult} = require('express-validator');
const { User, PatientProfile, DoctorProfile } = require("../dbconfig");
const CustomError = require('../utils/CustomError');
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/jwt');
const salt = parseInt(process.env.SALT)


const userController = {
    logIn: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let error = new CustomError('login validation failed', 400, errors.array())
            return res.status(error.statusCode).json({
                success: false,
                errors: error.getErrors()
            });
        }
        try {
            const userEmail = req.body.email;
            const user = await User.findOne({email: userEmail});
            const payload = {
                userId: user._id,
                email: user.email,
                fullName: user.fullname,
                role: user.role,
                profile: user.profile,
                version: 0,
            };
            const token = generateToken(payload);
            res.status(200).json({
                succes:true,
                token,
                payload
            });
        } catch(error){
            res.status(error.statusCode).json({
                success: false,
                error:error.message
            });
        }
    },
    createUser: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new CustomError('SingUp failed', 400, errors.array())
            return res.status(error.statusCode).json({
                success: false,
                errors: error.getErrors(),
            });
        };
        try {
            const newUser = {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, salt)
            };
            delete newUser.repassword;
            delete newUser.medicalKey;

            const modelo = ( newUser.role == 'PATIENT') ?  PatientProfile : DoctorProfile;
            const profile = await new modelo().save();
            newUser.profile = profile._id;
            
            const user =  await new User(newUser).save();
            return res.status(200).json({
                    success: true,
                    user,
                    profile
                });
        } catch(error) {
            return  res.status(error.statusCode).json({
                    success: false, 
                    error: error.message,
                    messagge:'error from controller'
            });
        }
    } 
};
module.exports = userController