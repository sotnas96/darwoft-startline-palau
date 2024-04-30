const { body } = require("express-validator");
const profileValidation =
[
    body('dni')
        .trim()
        .notEmpty()
        .isLength({min:5})
        .isNumeric().withMessage('Must be a number'),
    body('sex')
        .trim()
        .notEmpty()
        .isString()
        .toUpperCase(),
    body('healthCare')
        .trim()
        .notEmpty()
        .isString()
        .toUpperCase(),
    body('career')
        .trim()
        .notEmpty()
        .isString(),
    body('dateBirth.day')
        .trim()
        .notEmpty()
        .isNumeric().withMessage('Day of birth must be a number'),
    body('dateBirth.month')
        .trim()
        .notEmpty()
        .isNumeric().withMessage('Month of birth must be a number'),
    body('dateBirth.year')
        .trim()
        .notEmpty()
        .isNumeric().withMessage('Year of birth must be a number'),

];
module.exports = profileValidation;