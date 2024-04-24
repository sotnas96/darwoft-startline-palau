const { body } = require("express-validator");
const profileValidation =
[
    body('dni')
        .optional()
        .trim()
        .isLength({min:5})
        .isNumeric().withMessage('Must be a number'),
    body('sex')
        .optional()
        .trim()
        .isString()
        .toUpperCase(),
    body('healthCare')
        .optional()
        .trim()
        .isString()
        .toUpperCase(),
    body('career')
        .optional() 
        .trim()
        .isString(),
    body('dateBirth.day')
        .optional()
        .isNumeric().withMessage('Day of birth must be a number'),
    body('dateBirth.month')
        .optional()
        .isNumeric().withMessage('Month of birth must be a number'),
    body('dateBirth.year')
        .optional()
        .isNumeric().withMessage('Year of birth must be a number'),
    body('avatar')
        .optional()
];
module.exports = profileValidation;