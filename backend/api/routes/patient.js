const express = require ("express");
const patientController = require("../controller/patient");
// const isPatient = require('../middlewares/patientAuth');
const isAuthorized = require("../middlewares/authorization");
const profileValidation = require("../validations/patient/profileValidation");
const uploadFile = require("../utils/multer");

const patientRouter = express.Router();
patientRouter.route("/profile")
    .get(isAuthorized, patientController.getProfile)
    .put(isAuthorized, uploadFile.single('avatar'),  profileValidation , patientController.updateProfile)
    .delete(isAuthorized, patientController.deleteProfile); 

module.exports = patientRouter;
