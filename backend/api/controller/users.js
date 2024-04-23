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
            const user = await User.findOne({email: userEmail})
            if (!user)
            {
                throw new Error('email or password is not correct')
            }
            //create token if find
            const payload = 
            {
                userId: user._id,
                email: user.email,
                fullName: user.fullname,
            }
            const token = generateToken(payload)
            res.status(200).json({succes:true, token});
        }
        catch(error)
        {
            res.send(error.message);
        }
        //check if user exist
        //if exist creare 
    },
    createUser: async (req, res) =>
    {
        try
        {
            let errors = validationResult(req);
            if (!errors.isEmpty())
            {
                return res.status(400).json({success:false, errors: errors.array()}); 
            }
            const newUser = 
            {
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 10),
            };
            delete newUser.repassword;
            const user =  await new User(newUser).save()
            const newProfile = {user: user._id};
            const profile = await new Profile(newProfile).save();
            res.status(200).json({ success: true, user, profile});
        }
        catch(error)
        {
            res.status(200).json(error.message)
        }
    },
    userProfile: (req, res) =>
    {
        //create query to search user in db and bring data
        res.send(`this is user id: ${req.params.id}`)
    },
    updateProfile: async (req, res) =>
    {
        try
        {

        }
        catch(error)
        {
            
        }
        //validar lo datos de profile

    }
};
module.exports = userController;