const { verifyToken } = require("../utils/jwt");
let authToken = (req, res, next) =>
{  
    try
    {
        const token = req.headers.authorization;
        if (!token) throw new Error('invalid token');
        const verify = verifyToken(token);
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
module.exports = authToken