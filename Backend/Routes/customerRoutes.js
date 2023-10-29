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
  "/deletecustomer/:customerId",
  verifyUserRole,
  CustomerController.DeleteCustomerById
);



router.get("/getTotalCustomers",CustomerController.getTotalCustomers)
router.get("/RecentCustomer",CustomerController.RecentCustomer)

router.delete("/deletefiles/:id",CustomerController.Deletefiles)

module.exports = router;
