const express = require("express");
const authController = require("../Controller/authController");
const {
  verifyUserRole,
  verifyResetToken,
  determineUserRole,
} = require("../Middleware/TokenVerification");
const router = express.Router();
const upload = require("../Config/multerConfig");

// Register a Super Admin
router.post(
  "/registerSuperAdmin",
  upload.single("profile_pic"),
  authController.registerSuperAdmin
);

// Login a Super Admin
router.post("/loginSuperAdmin", determineUserRole, authController.loginUser);

// Delete a Super Admin
router.delete(
  "/deleteSuperAdmin",
  verifyUserRole,
  authController.deleteSuperAdmin
);

// Request Password Reset
router.post("/request-password-reset", authController.requestPasswordReset);

// Reset Password
router.post("/reset-password", verifyResetToken, authController.resetPassword);

module.exports = router;
