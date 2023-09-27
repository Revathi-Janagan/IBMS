const express = require("express");
const router = express.Router();
const CustomerController = require("../Controller/Customer/CustomerController")
const { verifyUserRole } = require("../middleware/middleware"); // Import the verifyUserRole middleware


router.post("/createcustomer",CustomerController.CreateCustomer);
router.get("/getallcustomer",CustomerController.GetAllCustomer);
router.get("getcustomebyid/:id",CustomerController.GetCustomerById);
router.put("/updatecustomer/:id",CustomerController.UpdateCustomer);
router.delete("/deletecustomer/:id",verifyUserRole,CustomerController.DeleteCustomerById);

module.exports = router;