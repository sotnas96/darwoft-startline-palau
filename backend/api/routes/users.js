const express = require ("express");
const router = express.Router();
const userController = require("../controller/users");
const signUpValidation = require("../validations/users/signUpValidation");
const logInAuth = require('../middlewares/authToken');
const profileValidation = require("../validations/users/profileValidation");


router.get("/profile", logInAuth, userController.getProfile);
router.put("/profile", logInAuth, profileValidation,userController.updateProfile);
router.post("/auth-register", signUpValidation, userController.createUser);
router.post('/login', userController.logIn);
router.delete("/profile", logInAuth, userController.deleteProfile);

module.exports = router