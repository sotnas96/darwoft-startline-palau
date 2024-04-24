const { body } = require("express-validator");
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
        .notEmpty().withMessage('Must complete with an email')
        .isEmail().withMessage('Please complete with a valid email format'),
    body('password')
        .trim()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)
        .withMessage('Minimum eight characters, at least one letter and one number'),
    body('repassword')
        .trim()
        .custom((value, { req }) =>
        {
            let pass1 = req.body.password;
            let pass2 = req.body.repassword;
            if (pass1 === pass2) return true;
            throw new Error('Passwords must match');

        })
];
module.exports = signUpValidation