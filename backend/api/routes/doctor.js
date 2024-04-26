const express = require ("express");
const doctorController = require("../controller/doctor");
const profileValidation = require("../validations/doctor/profileValidation");
const isDoctor = require('../middlewares/doctorAuth');
const doctorRouter = express.Router();
const uploadFile = require("../utils/multer");

doctorRouter.route('/profile') 
    .get(isDoctor, doctorController.getProfile)
    .put(isDoctor,  uploadFile.single('avatar'),profileValidation, doctorController.updateProfile) 
    .delete(isDoctor, doctorController.deleteProfile); 

module.exports = doctorRouter;