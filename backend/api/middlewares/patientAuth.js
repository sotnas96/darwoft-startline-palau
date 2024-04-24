const { verifyToken } = require("../utils/jwt");
let patientAuth = (req, res, next) =>
{  
    try
    {
        const token = req.headers.authorization;
        if (!token) throw new Error('Invalid token');

        const verify = verifyToken(token);
        if (verify.role !== 'PATIENT') throw new Error('User is not authorized');
        
        req.customData = verify;
        next();
    } 
    catch(error)
    {
        return res.status(400).json({
            success: false, 
            error, 
            message:'auth middleware failed'
        });
    }
}
module.exports = patientAuth