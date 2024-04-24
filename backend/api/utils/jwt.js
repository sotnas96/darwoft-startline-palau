const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY;

const generateToken = payload => 
{
    return jwt.sign(payload, key, {expiresIn: '1h'});
};

const verifyToken = token =>
{
        //if the token is valid, it returns the decode payload
        //else return an error object with name and message field
        const payload = jwt.verify(token, key);
        return payload;
};
 module.exports = 
 {
    generateToken,
    verifyToken
 }
