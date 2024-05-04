const { body } = require("express-validator");
const getMedicAreas = require("../../controller/doctor");
const isMedicArea = async (value) => {
    const medicAreas = await getMedicAreas();
    return medicAreas.some(obj => obj['area'] == value );
};

const profileValidation = [
    body('dni')
        .trim()
        .isLength({min:5})
        .isNumeric().withMessage('Must be a number'),
    body('sex')
        .trim()
        .isString()
        .toUpperCase(),
    body('dateBirth')
        .trim()
        .notEmpty()
        .isISO8601().withMessage('Please use format YYYY-MM'),
    body('medicalLicense')
        .trim()
        .isLength({min:4})
        .isNumeric().withMessage('Must be a number'),
    body('area')
        .trim()
        .notEmpty()
        .toUpperCase()
        .custom( async (value) => {
            const exist = await isMedicArea(value);
            if (!exist) throw new Error('Invalid medic area');
            return true
        }),
];
module.exports = profileValidation;