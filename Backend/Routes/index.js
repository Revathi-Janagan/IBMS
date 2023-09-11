const express = require("express");
const router = express.Router();


const authRouter = require("./authRoutes");
const empRouter = require("./employeeRoutes");

router.use("/auth", authRouter);
router.use("/emp",empRouter);

module.exports = router;