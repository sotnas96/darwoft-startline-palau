const { body } = require('express-validator');

const appointmentValid = [
    body('date')
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM-DD')
        .custom(value => {
            const chosenDate = new Date(value);
            if (chosenDate.getUTCDay() == 0 || chosenDate.getUTCDay() == 6) throw new Error("Weekends are not available");
            return true;
        }),
    body('time')
        .notEmpty()
        .custom(value => {
            const allowTime = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00']
            if (!allowTime.includes(value)) throw new Error('Chosen time not available. Try from 8:00 to 13:00');
            return true;
        })
];
module.exports = appointmentValid;