const { verifyToken } = require("../utils/jwt");
const doctorAuth = (req, res, next) => {  
    try {
        const token = req.headers.authorization;
        if (!token) throw new Error('Invalid token');

        const verify = verifyToken(token);
        if (verify.role !== 'DOCTOR') throw new Error('User is not authorized');
        
        req.customData = verify;
        next();

    } catch(error) {
        return res.status(400).json({
            success: false, 
            error:error.message, 
            message:'auth middleware failed'
        });
    }
};
module.exports = doctorAuth