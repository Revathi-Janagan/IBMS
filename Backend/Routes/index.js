const express = require("express");
const router = express.Router();


const authRouter = require("./authRoutes");
const empRouter = require("./employeeRoutes");
const customerRouter = require("./customerRoutes")

router.use("/auth", authRouter);
router.use("/emp",empRouter);
router.use("/customer",customerRouter);

module.exports = router;