const {validationResult} = require('express-validator');
const { User, PatientProfile, DoctorProfile } = require("../dbconfig");
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/jwt');
const salt = parseInt(process.env.SALT)


const userController =
{
    logIn: async (req, res) => 
    {
        try
        {
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
            // if (!user) throw new Error('credentials are incorrect');
            const payload = 
            {
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
        }
        catch(error)
        {
            res.status(400).json({
                success: false,
                error:error.message
            });
        }
        //check if user exist
        //if exist creare 
    },
    createUser: async (req, res) =>
    {
        try
        {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                    message: 'Validation result error'
                });
            };
            const newUser = 
            {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, salt)
            };
            delete newUser.repassword;
            delete newUser.medicalKey;
            
            const user =  await new User(newUser).save();
            const newProfile = {user: user._id};
            let profile = undefined;
            if (user.role === 'PATIENT')
            {
                profile = await new PatientProfile(newProfile).save();
            }
            else
            {
                profile = await new DoctorProfile(newProfile).save()
            }

            res.status(200).json({
                success: true,
                user,
                profile
            });
        }
        catch(error)
        {
            return  res.status(400).json({
                    success: false, 
                    error,
                    messagge:'error from controller'
            });
        }
    }
};
module.exports = userController