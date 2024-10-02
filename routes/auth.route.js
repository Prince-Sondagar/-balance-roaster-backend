const router = require('express').Router();

const { createUserController, loginUserController, forgotPasswordController, resetPasswordController } = require("../controllers/auth.controller");

router.post("/login", loginUserController);

router.post("/signup", createUserController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

module.exports = router;