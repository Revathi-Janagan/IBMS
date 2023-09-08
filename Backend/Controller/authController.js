const connection = require("../Helper/db");
const { sendRegisterEmail } = require("../Helper/nodemailer");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  registerSuperAdmin: (req, res) => {
    console.log("Inside Super Admin Registration");
    const { name, email, password, phone_number, profile_pic } = req.body;
    if (!name || !email || !password || !phone_number || !profile_pic) {
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

      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      // If there is no super admin, proceed with the registration
      const insertSQL = "INSERT INTO super_admin (name, email, password, phone_number, profile_pic) VALUES (?, ?, ?, ?, ?)";
      const values = [name, email, hashedPassword, phone_number, profile_pic];
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
  },
  deleteSuperAdmin: (req, res) => {
    const { email } = req.body; // Assuming  pass the email as a route parameter

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
    // Implement login logic here
    console.log("Inside Login User....");
    const { email, password } = req.body;
    const sql = "SELECT * FROM super_admin WHERE email = ?";
    connection.query(sql, [email], (err, result) => {
      if (err) {
        return res.status(400).send({ message: "Internal Error" });
      }
      const user = result[0];
      if (!user) {
        return res.status(400).send({ message: "User not Found" });
      }
      bcrypt.compare(password, user.password, async function (err, result) {
        if (err) {
          return res
            .status(400)
            .send({ message: "Error while creating hashing Password" });
        } else if (!result) {
          return res.status(400).send({ message: "Password Not Match" });
        }
       
      
        res.status(200).json({
          message: "Login Success",
          user: user,
          
        });
        // res .status(200).send ({message:"Login Successfull", user:userId});
      });
    });
  },
  };

