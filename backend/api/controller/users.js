const {validationResult} = require('express-validator');
const { User, Profile } = require("../dbconfig");
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/jwt');

const userController =
{
    logIn: async (req, res) => 
    {
        try
        {
            let userEmail = req.body.email;
            const user = await User.findOne({email: userEmail});
            if (!user) throw new Error('email or password is not correct');
            
            //create token if find
            const payload = 
            {
                userId: user._id,
                email: user.email,
                fullName: user.fullname,
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
            if (!errors.isEmpty()) throw new Error({
                success:false,
                errors: errors.array()
            });
            
            const newUser = 
            {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 10),
            };
            delete newUser.repassword;
            const user =  await new User(newUser).save();
            const newProfile = {user: user._id};
            const profile = await new Profile(newProfile).save();
            res.status(200).json({
                success: true,
                user,
                profile
            });
        }
        catch(error)
        {
            res.status(400).json({
                success: false, 
                error
            });
        }
    },
    getProfile: async (req, res) =>
    {
        //create query to search user in db and bring data
        try
        {
            let payload = req.customData
            let profile = await Profile.findOne({user:payload.userId});
            if(!profile) throw new Error('user not found');
            res.status(200).json({success:true, payload, profile}); 
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
            let userProfile = {...req.body};
            const profileUpdate = await Profile.findOneAndUpdate(
                userId,
                userProfile,
                {
                    returnOriginal: false
                }
            );
            res.status(200).json({success:true, message:'user updated', profileUpdate});
        }
        catch(error)
        {
            res.status(400).json({success:false, error, message:'controller update failed'});
        }
        //validar lo datos de profile

    },
    deleteProfile: async (req, res) =>
    {
        try
        {
            //get user info
            // const reVersionPayload = {...req.customData, version: version++};
            // console.log(reVersionPayload)
            const user = req.customData.userId;
            const deleteProfile = await Profile.deleteOne({user:user});
            const deleteUser = await User.deleteOne({_id:user});
            return res.status(200).json({success: true, deleteProfile, deleteUser});
        }
        catch(error)
        {
            res.status(400).json({success: false, error:error});
        }
    }
};
module.exports = userController