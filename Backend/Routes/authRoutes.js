const express = require("express");
const authController = require("../Controller/authController");
const { 
    verifyUserRole,
    verifyResetToken,
    determineUserRole, } = require("../Middleware/TokenVerification");
const router = express.Router();

  

router.post("/registerSuperAdmin", authController.registerSuperAdmin);
router.post("/loginSuperAdmin",determineUserRole, authController.loginUser);
router.delete("/deleteSuperAdmin",verifyUserRole, authController.deleteSuperAdmin);
router.post("/requestPasswordReset", authController.requestPasswordReset);
router.post("/resetPassword", verifyResetToken, authController.resetPassword);


module.exports = router;
