const connection = require("../Helper/db");
const { sendRegisterEmail } = require("../Helper/nodemailer");
const multer = require("multer");
const path = require("path");

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder where the image will be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the image
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

// Create a Multer instance with the configured storage
const upload = multer({ storage: storage });

module.exports = {
  registerSuperAdmin: (req, res) => {
    console.log("Inside Super Admin Registration");
    const { name, email, password, phone_number } = req.body;

    if (!name || !email || !password || !phone_number) {
      return res.status(400).send({ message: "Please Fill All the Fields" });
    }

    // Check if there is already a super admin
    const checkSuperAdminSql = "SELECT * FROM super_admin";
    connection.query(checkSuperAdminSql, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
      }

      // If there is already a super admin, return an error
      if (result.length > 0) {
        return res.status(409).send({ message: "Super Admin already exists" });
      }

      // If there is no super admin, proceed with the registration
      upload.single("profile_pic")(req, res, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error uploading profile picture" });
        }

        // Get the filename of the uploaded profile picture
        const profile_pic = req.file ? req.file.filename : null;

        const insertSQL =
          "INSERT INTO super_admin (name, email, password, phone_number, profile_pic) VALUES (?, ?, ?, ?, ?)";
        const values = [name, email, password, phone_number, profile_pic];

        connection.query(insertSQL, values, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal Error" });
          } else if (result.affectedRows === 0) {
            return res.status(500).send({ message: "No Rows Affected" });
          } else {
            sendRegisterEmail(email);
            console.log(email);
            res.status(200).send({
              message: `Thank You ${name.split(" ")[0]} for registering with us`,
            });
          }
        });
      });
    });
  },

  deleteSuperAdmin: (req, res) => {
    const { email } = req.body; // Assuming you pass the email as a route parameter

    if (!email) {
      return res.status(400).send({ message: "Email is required to delete a super admin" });
    }

    // Check if the super admin exists
    const checkSuperAdminSql = "SELECT * FROM super_admin WHERE email = ?";
    connection.query(checkSuperAdminSql, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
      }

      // If no super admin with the provided email exists, return an error
      if (result.length === 0) {
        return res.status(404).send({ message: "Super Admin not found" });
      }

      // Delete the super admin
      const deleteSuperAdminSql = "DELETE FROM super_admin WHERE email = ?";
      connection.query(deleteSuperAdminSql, [email], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Internal Error" });
        }

        // Check if any rows were affected by the delete operation
        if (result.affectedRows === 0) {
          return res.status(500).send({ message: "No Rows Affected" });
        }

        res.status(200).send({ message: "Super Admin deleted successfully" });
      });
    });
  },

  loginUser: (req, res) => {
    
  },
};
