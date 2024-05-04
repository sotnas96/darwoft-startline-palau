const express = require ("express");
const patientController = require("../controller/patient");
// const isPatient = require('../middlewares/patientAuth');
const isAuthorized = require("../middlewares/authorization");
const profileValidation = require("../validations/patient/profileValidation");
const appointmentValidation = require("../validations/patient/appointmentValid");
const uploadFile = require("../utils/multer");

const patientRouter = express.Router();
patientRouter.route("/profile")
    .get(isAuthorized, patientController.getProfile)
    .put(isAuthorized, uploadFile.single('avatar'), profileValidation , patientController.updateProfile)
    .delete(isAuthorized, patientController.deleteProfile); 

patientRouter.route("/appointments")
    .get(isAuthorized, patientController.getAppointments)
    .post(isAuthorized, appointmentValidation, patientController.newAppointment)
    .delete(isAuthorized, patientController.deleteAppointment);

patientRouter.get("/schedule/list", isAuthorized, patientController.allSchedules);
module.exports = patientRouter;
