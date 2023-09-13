const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controller/Employee/EmployeeController");
const { verifySuperAdmin } = require("../Middleware/TokenVerification");



router.post("/createEmployee",verifySuperAdmin, EmployeeController.createEmployee);
router.get("/getAllEmployees", verifySuperAdmin,EmployeeController.getAllEmployees);
router.get("/getEmployeeById/:id",verifySuperAdmin,EmployeeController.getEmployeeById);
router.put("/updateEmployee/:id",verifySuperAdmin,EmployeeController.updateEmployeeById);
router.delete("/deleteEmployeeById/:id",verifySuperAdmin,EmployeeController.deleteEmployeeById)


module.exports = router;