const express = require("express");
const authController = require("../Controller/authController");
const router = express.Router();

router.post("/registerSuperAdmin", authController.registerSuperAdmin);
router.post("/loginSuperAdmin", authController.loginUser);

module.exports = router;
