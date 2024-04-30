const { body } = require('express-validator');

const appointmentValid = [
    body('date')
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM-DD'),
    body('time')
        .notEmpty()
        .custom(value => {
            const allowTime = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00']
            return allowTime.includes(value) ?  true : false;
        })
];
module.exports = appointmentValid;