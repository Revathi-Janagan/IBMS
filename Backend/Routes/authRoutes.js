const express = require("express");
const authController = require("../Controller/authController");
const router = express.Router();

router.post("/registerSuperAdmin", authController.registerSuperAdmin);
router.post("/loginSuperAdmin", authController.loginUser);
router.delete("/deleteSuperAdmin",authController.deleteSuperAdmin);

module.exports = router;
