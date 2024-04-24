const { Router }= require ("express");
const doctorController = require("../controller/doctor");
const isDoctor = require('../middlewares/doctorAuth');
// const profileValidation = require("../validations/patient/profileValidation");

const router = Router();

router.route('profile') 
    .get(isDoctor, doctorController.getProfile)
    .put(isDoctor, doctorController.updateProfile) 
    .delete(isDoctor, doctorController.deleteProfile); 

module.exports = router;