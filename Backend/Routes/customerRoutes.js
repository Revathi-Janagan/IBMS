const express = require("express");
const router = express.Router();
const CustomerController = require("../Controller/Customer/CustomerController");
const { verifyUserRole } = require("../Middleware/TokenVerification"); // Import the verifyUserRole middleware
const upload = require("../Config/multerConfig");

router.post(
  "/createcustomer",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  CustomerController.CreateCustomer
);
router.get("/getallcustomer", CustomerController.GetAllCustomer);
router.get("/getcustomerbyid/:id", CustomerController.GetCustomerById);
router.put(
  "/updatecustomer/:id",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  CustomerController.UpdateCustomer
);
router.delete(
  "/deletecustomer/:id",
  verifyUserRole,
  CustomerController.DeleteCustomerById
);



router.get("/getTotalCustomers",CustomerController.getTotalCustomers)

module.exports = router;
