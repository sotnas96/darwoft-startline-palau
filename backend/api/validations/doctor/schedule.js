const { body } = require("express-validator");
const scheduleValidation = [
    body('date')
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM')
]
module.exports = scheduleValidation;
