const express = require ("express");
const mainRouter = express.Router();

const patientRoutes = require('../routes/patient');
const doctorRoutes = require("../routes/doctor");

const mainController = require("../controller/main");


const signUpValidation = require("../validations/user/signUpValidation");
const logInValidation = require("../validations/user/logInValidation");


mainRouter.use('/patient', patientRoutes);
mainRouter.use('/doctor', doctorRoutes);

mainRouter.post("/auth-register", signUpValidation, mainController.createUser);
mainRouter.post('/login', logInValidation, mainController.logIn);

module.exports =  mainRouter 