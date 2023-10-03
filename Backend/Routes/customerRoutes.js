const express = require("express");
const router = express.Router();
const CustomerController = require("../Controller/Customer/CustomerController");
const { verifyUserRole } = require("../middleware/middleware"); // Import the verifyUserRole middleware
const { uploadImage, uploadDocument } = require("../Config/multerConfig");

router.post(
  "/createcustomer",
  uploadImage.single("userImage"),
  uploadDocument.single("file_content"),
  CustomerController.CreateCustomer
);
router.get("/getallcustomer", CustomerController.GetAllCustomer);
router.get("getcustomebyid/:id", CustomerController.GetCustomerById);
router.put("/updatecustomer/:id", CustomerController.UpdateCustomer);
router.delete(
  "/deletecustomer/:id",
  verifyUserRole,
  CustomerController.DeleteCustomerById
);

module.exports = router;
