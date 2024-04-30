const { body } = require("express-validator");
const { Schedule } = require("../../dbconfig");
const scheduleValidation = [
    body('startDate')
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM-DD')
        .custom(async (value, { req }) => {
            const todayDate = new Date();
            const startDate = new Date(value);
            if (startDate <= todayDate) throw new Error('Start date is not valid. Choose a later one')
            const checkDate = await Schedule.findOne({
                                                        doctor: req.customData.userId,
                                                        'schedule.date': startDate
                                                    })
            if (checkDate) throw new Error("The start date is already uploaded")
            return true;
        }),
    body('endDate')
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM-DD')
        .custom(async (value, { req }) => {
            const endDate = new Date(value)
            const startDate = new Date(req.body.startDate);

            if (endDate < startDate) throw new Error('Must choose a date same or later than the start day')
            const checkDate = await Schedule.findOne({doctor: req.customData.userId, 'schedule.date': endDate})
            if (checkDate) throw new Error('The end date is already uploaded')
            return true
        })
]
module.exports = scheduleValidation;
