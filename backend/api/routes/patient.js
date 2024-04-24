const express = require ("express");
const patientController = require("../controller/patient");
const isPatient = require('../middlewares/patientAuth');
const profileValidation = require("../validations/patient/profileValidation");

const router = express.Router();
router.route("/profile")
    .get(isPatient, patientController.getProfile)
    .put(isPatient, profileValidation, patientController.updateProfile)
    .delete(isPatient, patientController.deleteProfile); 

module.exports = router;
