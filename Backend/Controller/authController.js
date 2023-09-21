const connection = require("../Helper/db");
const {
  sendRegisterEmail,
  sendPasswordResetEmail,
} = require("../Helper/nodemailer");
const bcrypt = require("bcrypt");
const { RESET_ACCESS_TOKEN, ACCESS_TOKEN } = require("../Config/config");
const jwt = require("jsonwebtoken");

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
      const insertSQL =
        "INSERT INTO super_admin (name, email, password, phone_number, profile_pic) VALUES (?, ?, ?, ?, ?)";
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
      return res
        .status(400)
        .send({ message: "Email is required to delete a super admin" });
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
    const { email, password } = req.body;
    console.log("Content is",req.body);

    // Check if the user is a super admin
    const superAdminSql = "SELECT * FROM super_admin WHERE email = ?";
    connection.query(superAdminSql, [email], (err, superAdminResult) => {
      if (err) {
        return res.status(400).send({ message: "Internal Error", error:err });
      }
      const superAdmin = superAdminResult[0];
       console.log("Superadmin is",superAdmin);

      if (superAdmin) {
        // The user is a super admin
        console.log(superAdmin.super_admin_id);

        req.user = {
          role: "superadmin", // Set the user's role
          id: superAdmin.super_admin_id, // Include other relevant user information
        };
        console.log("User is a superadmin", req.user);

        bcrypt.compare(password, superAdmin.password, (err, result) => {
          if (err) {
            return res
              .status(400)
              .send({ message: "Error while comparing passwords" });
          }
          if (result) {
            const isSuperadmin = true; // Super admin has full access
            const tokenPayload = {
              userId: superAdmin.super_admin_id,
              isSuperadmin,
            };
            console.log("Token Payload", tokenPayload);
            const token = jwt.sign(tokenPayload, ACCESS_TOKEN, {
              expiresIn: "12h",
            });
            return res.status(200).json({
              message: "Login Success",
              user: superAdmin,
              AccessToken: token,
            });
          }
          return res.status(400).send({ message: "Password Not Match" });
        });
      } else {
        // The user is not a super admin, check if they are an admin
        const adminSql = "SELECT * FROM admin WHERE email = ?";
        connection.query(adminSql, [email], (err, adminResult) => {
          if (err) {
            return res.status(400).send({ message: "Internal Error" });
          }
          const admin = adminResult[0];
          console.log("admin Result is",admin)

          if (!admin) {
            return res
              .status(400)
              .send({ message: "User not Found", error: err });
          }
          req.user = {
            role: "admin", // Set the user's role
            id: admin.admin_id, // Include other relevant user information
          };

          // Check if the user is an admin
          bcrypt.compare(password, admin.password, (err, result) => {
            if (err) {
              return res
                .status(400)
                .send({
                  message: "Error while comparing passwords",
                  error: err,
                });
            }
            if (result) {
              const isSuperadmin = false; // Admin is not a super admin
              const tokenPayload = {
                userId: admin.admin_id,
                isSuperadmin,
              };
              const token = jwt.sign(tokenPayload, ACCESS_TOKEN, {
                expiresIn: "12h",
              });
              return res.status(200).json({
                message: "Login Success",
                user: admin,
                AccessToken: token,
              });
            }
            return res
              .status(400)
              .send({ message: "Password Not Match", error: err });
          });
        });
      }
    });
  },

  requestPasswordReset: (req, res) => {
    const { email } = req.body;

    // Check if the user with the provided email exists in your database
    const checkUserSql = "SELECT * FROM super_admin WHERE email = ?";
    connection.query(checkUserSql, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error" });
      }

      // If no user with the provided email exists, return an error
      if (result.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }

      // Generate a reset token with a short expiration time (e.g., 15 minutes)
      const resetToken = jwt.sign({ email: email }, RESET_ACCESS_TOKEN, {
        expiresIn: "15m",
      });

      sendPasswordResetEmail(email, resetToken);
      // Return a success message to the user
      res.status(200).send({
        message: "Password reset email sent successfully",
        Resettoken: resetToken,
      });
    });
  },
  resetPassword: (req, res) => {
    const { newPassword } = req.body;
    const { email } = req.resetTokenData;

    if (!newPassword) {
      return res.status(400).send({ message: "New password is required" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    // Update the user's password in the database
    const updatePasswordSql =
      "UPDATE super_admin SET password = ? WHERE email = ?";
    connection.query(
      updatePasswordSql,
      [hashedPassword, email],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Internal Error" });
        }

        if (result.affectedRows === 0) {
          return res.status(500).send({ message: "No Rows Affected" });
        }

        res.status(200).send({ message: "Password reset successfully" });
      }
    );
  },
};
