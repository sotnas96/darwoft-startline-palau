const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userSchema  = require("./model/User");
const profileSchema = require("./model/Profile");

dotenv.config();
const connectionString = process.env.MONGODB_URI;
const User = mongoose.model('User', userSchema);
const Profile = mongoose.model('Profile', profileSchema);

const connectionToDB = async () =>
{
    try 
    {
        await mongoose.connect(connectionString, 
            {
                autoIndex: true
            });
        console.log('connected to Mongo db atlas');
    }
    catch(error)
    {
        console.error(error);
    }
};
module.exports = 
{
    User,
    Profile,
    connectionToDB,

};