const express = require ("express");
const patientController = require("../controller/patient");
const isPatient = require('../middlewares/patientAuth');
const profileValidation = require("../validations/patient/profileValidation");
const uploadFile = require("../utils/multer");

const patientRouter = express.Router();
patientRouter.route("/profile")
    .get(isPatient, patientController.getProfile)
    .put(isPatient,uploadFile.single('avatar'),  profileValidation , patientController.updateProfile)
    .delete(isPatient, patientController.deleteProfile); 

module.exports = patientRouter;
