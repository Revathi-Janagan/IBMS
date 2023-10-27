const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controller/Employee/EmployeeController");
const { verifyUserRole } = require("../Middleware/TokenVerification");
const upload = require("../Config/multerConfig");

// Route for creating an employee (superadmins only can create admins)
router.post(
  "/createEmployee",
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  verifyUserRole,
  async (req, res, next) => {
    try {
      console.log("Inside createEmployee route handler");
      await EmployeeController.createEmployee(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getallemployees", async (req, res, next) => {
  try {
    // Allow both admins and superadmins to get all employees
    await EmployeeController.getAllEmployees(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for getting an employee by ID (admins and superadmins)
router.get("/getEmployeeById/:id", async (req, res, next) => {
  try {
    // Allow both admins and superadmins to get an employee by ID
    await EmployeeController.getEmployeeById(req, res, next);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for updating an employee
router.put(
  "/updateEmployee/:id",
  upload.fields([{ name: "profile_pic", maxCount: 1 }]),
  async (req, res, next) => {
    try {
      await EmployeeController.updateEmployeeById(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route for deleting an employee (superadmins only)
router.delete(
  "/deleteEmployeeById/:id",
  verifyUserRole,
  async (req, res, next) => {
    try {
      // Check if the user is a superadmin
      const { isSuperadmin } = req.user;
      console.log("checking", req.user);

      if (isSuperadmin) {
        // Allow superadmins to delete employees
        await EmployeeController.deleteEmployeeById(req, res, next);
      } else {
        // Deny access for non-superadmins
        return res.status(403).json({ error: "Forbidden: Not Authorized" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/getalladmins",EmployeeController.adminsList)

router.get("/getTotalEmployees",EmployeeController.getTotalEmployees)

router.get("/RecentEmployee",EmployeeController.RecentEmployee)


module.exports = router;
