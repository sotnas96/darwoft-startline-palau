const express = require ("express");
const router = express.Router();

//Traigo el controller
const userController = require("../controller/users");

//traigo la validacion
const signUpValidation = require("../validations/users/signUpValidation");
//users request
router.get("/list", userController.list);
router.get("/:id", userController.userDetail);
//user sign up
router.post("/register", signUpValidation, userController.signUp);

module.exports = router;