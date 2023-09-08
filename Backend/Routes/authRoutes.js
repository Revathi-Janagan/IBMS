const express = require("express");
const authController = require("../Controller/authController");
const { verifyResetToken } = require("../Middleware/TokenVerification");
const router = express.Router();

router.post("/registerSuperAdmin", authController.registerSuperAdmin);
router.post("/loginSuperAdmin", authController.loginUser);
router.delete("/deleteSuperAdmin", authController.deleteSuperAdmin);
router.post("/resetpassword",verifyResetToken,authController.passwordReset);

module.exports = router;
