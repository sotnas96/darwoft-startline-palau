const { verifyToken } = require("../utils/jwt");
const authorization = (req, res, next) => {
    try {
        const endpoint = req.originalUrl;
        const token = req.headers.authorization;
        if (!token) throw new Error('Invalid token')

        const payload = verifyToken(token);
        req.customData = payload
        if (payload && payload.role === 'DOCTOR' && endpoint.toUpperCase().includes(payload.role)) {
            next();
        }
        else if (payload && payload.role === 'patient' && endpoint.toUpperCase().includes(payload.role)) {
            next();
        } else {
            throw new Error('User is not authorized')
        }
    } catch (error) {
        res.status(400).json({success: false, error: error.message})
    }
    

};
module.exports = authorization;