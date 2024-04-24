const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../../dbconfig');
const logInValidation =
[
    body('email')
        .trim()
        .notEmpty().withMessage('cannot be empty')
        .isEmail().withMessage('must be a valid email')
        .custom(async value =>
        {
            const exist = await User.findOne({email: value});
            if (!exist) throw new Error('Invalid credentials');
        }),
    body('password')
        .trim()
        .notEmpty()
        .custom(async (value, { req })=>
        {
            const user = await User.findOne({email: req.body.email});
            if (!user) throw new Error('Invalid Credentials');
            const credentialCheck = bcrypt.compareSync(value, user.password);
            if (!credentialCheck) throw new Error('Invalid Credentials');
            return true;
        })
]
module.exports = logInValidation;
