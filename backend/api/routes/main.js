const express = require ("express");
const patientRoutes = require('../routes/patient');
const doctorRoutes = require("../routes/doctor");
const mainController = require("../controller/main");
const signUpValidation = require("../validations/user/signUpValidation");
const logInValidation = require("../validations/user/logInValidation");

const router = express.Router();

router.post("/auth-register", signUpValidation, mainController.createUser);
router.post('/login', logInValidation, mainController.logIn);
router.use('/patient', patientRoutes);
router.use('/doctor', doctorRoutes);


module.exports = router