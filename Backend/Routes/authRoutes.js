const express = require("express");
const authController = require("../Controller/authController");
const { verifyResetToken } = require("../Middleware/TokenVerification");
const router = express.Router();

router.post("/registerSuperAdmin", authController.registerSuperAdmin);
router.post("/loginSuperAdmin", authController.loginUser);
router.delete("/deleteSuperAdmin", authController.deleteSuperAdmin);
router.post("/requestPasswordReset", authController.requestPasswordReset);
router.post("/resetPassword", verifyResetToken, authController.resetPassword);


module.exports = router;
