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
    body('dateBirth')
        .trim()
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM')

];
module.exports = profileValidation;