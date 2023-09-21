const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controller/Employee/EmployeeController");
const { verifyUserRole,determineUserRole} = require("../Middleware/TokenVerification");






// Route for creating an employee (admins and superadmins only)
router.post("/createEmployee", determineUserRole, (req, res, next) => {
  // Check if the user is an admin or superadmin
  const { isAdmin, isSuperadmin } = req.user;

  if (isAdmin || isSuperadmin) {
    // Allow admins and superadmins to create employees
    EmployeeController.createEmployee(req, res, next);
  } else {
    // Deny access for non-admins and non-superadmins
    return res.status(403).json({ error: "Forbidden: Not Authorized" });
  }
});

// Route for getting all employees (admins and superadmins only)
router.get("/getAllEmployees", verifyUserRole, (req, res, next) => {
  // Check if the user is an admin or superadmin
  const { isAdmin, isSuperadmin } = req.user;

  if (isAdmin || isSuperadmin) {
    // Allow admins and superadmins to get all employees
    EmployeeController.getAllEmployees(req, res, next);
  } else {
    // Deny access for non-admins and non-superadmins
    return res.status(403).json({ error: "Forbidden: Not Authorized" });
  }
});

// Route for getting an employee by ID (admins and superadmins only)
router.get("/getEmployeeById/:id", verifyUserRole, (req, res, next) => {
  // Check if the user is an admin or superadmin
  const { isAdmin, isSuperadmin } = req.user;

  if (isAdmin || isSuperadmin) {
    // Allow admins and superadmins to get an employee by ID
    EmployeeController.getEmployeeById(req, res, next);
  } else {
    // Deny access for non-admins and non-superadmins
    return res.status(403).json({ error: "Forbidden: Not Authorized" });
  }
});

// Route for updating an employee (admins only)
router.put("/updateEmployee/:id", verifyUserRole, (req, res, next) => {
  // Check if the user is an admin
  const { isAdmin } = req.user;

  if (isAdmin) {
    // Allow admins to update employees
    EmployeeController.updateEmployeeById(req, res, next);
  } else {
    // Deny access for non-admins
    return res.status(403).json({ error: "Forbidden: Not Authorized" });
  }
});

// Route for deleting an employee (superadmins only)
router.delete("/deleteEmployeeById/:id", verifyUserRole, (req, res, next) => {
  // Check if the user is a superadmin
  const { isSuperadmin } = req.user;

  if (isSuperadmin) {
    // Allow superadmins to delete employees
    EmployeeController.deleteEmployeeById(req, res, next);
  } else {
    // Deny access for non-superadmins
    return res.status(403).json({ error: "Forbidden: Not Authorized" });
  }
});

module.exports = router;
