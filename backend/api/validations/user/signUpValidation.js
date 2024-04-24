const { body } = require("express-validator");
const { User } = require('../../dbconfig');
const medicalKey = process.env.MEDICAL_KEY;
console.log(medicalKey);
const signUpValidation =
[
    body('name')
        .trim()
        .notEmpty().withMessage('Your name is required')
        .toLowerCase()
        .isLength({ min:3 }).withMessage('name must have at least 3 letters'),
    body('lastName')
        .trim()
        .notEmpty().withMessage('Your name is required')
        .toLowerCase()
        .isLength({ min:3 }).withMessage('name must have at least 3 letters'),
    body('email')
        .trim()
        .notEmpty().withMessage('cannot be empty')
        .isEmail().withMessage('must be a valid email')
        .custom(async value =>
        {
            const exist = await User.findOne({email: value});
            if (exist) throw new Error('Email is already in use');
            return true;
        }),
    body('role')
        .trim()
        .notEmpty()
        .custom( value =>
        {
           if (value === 'PATIENT' || value === 'DOCTOR') return true;
           return false;
        }),
    body('medicalKey')
        .trim()
        .custom((value, { req }) =>
        {
            const role = req.body.role;
            if (role === 'DOCTOR' && medicalKey !== value) throw new Error ('Invalid medical key');
            return true;
        }),
    body('password')
        .trim()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
        .withMessage('Minimum eight characters, at least one letter and one number'),
    body('repassword')
        .trim()
        .custom((value, { req }) =>
        {
            const pass1 = req.body.password;
            if (pass1 === value) return true;
            throw new Error('Passwords must match');

        })
];
module.exports = signUpValidation