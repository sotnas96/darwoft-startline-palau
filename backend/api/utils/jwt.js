const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY

const generateToken = payload => 
{
    return jwt.sign(payload, key, {expiresIn: '24h'});
};

const verifyToken = token =>
{
    try
    {
        //if the token is valid, it returns the decode payload
        return jwt.verify(token, key)
    }
    catch(error)
    {
        return null;
    }
};
 module.exports = 
 {
    generateToken,
    verifyToken
 }
