const express = require ("express");
const router = express.Router();
const userController = require("../controller/users");
const signUpValidation = require("../validations/users/signUpValidation");


router.get("/profile/:id", userController.userProfile);
router.put("/profile/:id", userController.updateProfile);
router.post("/auth-register", signUpValidation, userController.createUser);
router.post('/login', userController.logIn);

module.exports = router;