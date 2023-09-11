const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controller/Employee/EmployeeController");


router.post("/createEmployee", EmployeeController.createEmployee);
router.get("/getAllEmployees", EmployeeController.getAllEmployees);
router.get("/getEmployeeById/:id",EmployeeController.getEmployeeById);
router.put("/updateEmployee/:id",EmployeeController.updateEmployeeById);
router.delete("/deleteEmployeeById/:id",EmployeeController.deleteEmployeeById)


module.exports = router;