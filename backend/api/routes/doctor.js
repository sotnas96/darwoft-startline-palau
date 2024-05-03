const express = require ("express");
const doctorRouter = express.Router();

const doctorController = require("../controller/doctor");
const profileValidation = require("../validations/doctor/profileValidation");
const uploadFile = require("../utils/multer");

const isAuthorized = require("../middlewares/authorization");
const scheduleValidation = require("../validations/doctor/schedule");
// const isDoctor = require('../middlewares/doctorAuth');

doctorRouter.route('/profile') 
    .get(isAuthorized, doctorController.getProfile)
    .put(isAuthorized,  uploadFile.single('avatar'),profileValidation, doctorController.updateProfile) 
    .delete(isAuthorized, doctorController.deleteProfile); 

doctorRouter.get('/appointments', isAuthorized, doctorController.getAppointments);
doctorRouter.delete('/appointments', isAuthorized, doctorController.cancelAppointmet);  

doctorRouter.post('/schedule', isAuthorized, scheduleValidation, doctorController.uploadSchedule) 

module.exports = doctorRouter;