const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN, RESET_ACCESS_TOKEN } = require("../Config/config");
const connection = require("../Helper/db");

// Function to generate a JWT token with the user's role
const generateToken = (user) => {
  const tokenPayload = {
    id: user.id,
    username: user.username,
  };

  if (user.superadminId) {
    tokenPayload.isSuperadmin = true; // Superadmin has full access
  } else if (user.isAdmin) {
    tokenPayload.isAdmin = true; // Admin has restricted access
  } else if (user.employeeId) {
    tokenPayload.isEmployee = true; // Employee-specific actions can be handled
  }

  const options = {
    expiresIn: "12h",
  };
  console.log("Token payload is", tokenPayload);
  const token = jwt.sign(tokenPayload, ACCESS_TOKEN, options);

  return token;
};

const verifyUserRole = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Forbidden: Invalid token", error: err });
    }

    req.user = decoded;
    console.log("Decoded Token:", decoded);

    if (decoded.isSuperadmin) {
      // User is a superadmin, allow all actions
      next();
    } else if (!decoded.isSuperadmin) {
      // User is an admin, but only allow creating non-admin employees
      console.log("isAdmin in request body:", req.body.isAdmin);
      if (!req.body.isAdmin) {
        // isAdmin is false in the request, allow the action
        next();
      } else {
        console.log("isAdmin is true in the request");
        // isAdmin is true in the request, deny access
        return res.status(403).json({ error: "Forbidden: Not Authorized" });
      }
    } else {
      console.log("User is not an admin");
      // User is not an admin, deny access
      return res.status(403).json({ error: "Forbidden: Not Authorized" });
    }
  });
};


// Middleware to verify the reset token
const verifyResetToken = (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ message: "Reset token is required" });
  }

  jwt.verify(token, RESET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token", error: err });
    }

    req.resetTokenData = decoded;

    next();
  });
};

const determineUserRole = (req, res, next) => {
  const { email } = req.body;

  // Check if the user is a superadmin
  const superAdminSql = "SELECT * FROM super_admin WHERE email = ?";
  connection.query(superAdminSql, [email], (err, superAdminResult) => {
    if (err) {
      return res.status(400).send({ message: "Internal Error" });
    }
    const superAdmin = superAdminResult[0];
    console.log("SUPER admin Email is", superAdmin);

    if (superAdmin) {
      // The user is a superadmin
      req.user = {
        isAdmin: false,
        isSuperadmin: true,
        id: superAdmin.super_admin_id,
      };
      console.log("user is", req.user);
      next();
    } else {
      const adminSql = "SELECT * FROM admin WHERE email = ?";

      connection.query(adminSql, [email], (err, adminResult) => {
        if (err) {
          return res
            .status(400)
            .send({ message: "Internal Error", error: err });
        }
        const admin = adminResult[0];
        console.log("admin is", admin);

        if (admin) {
          // The user is an admin
          req.user = {
            isAdmin: true,
            isSuperadmin: false,
            id: admin.admin_id,
          };
          next();
        }
      });
    }
  });
};

module.exports = {
  generateToken,
  verifyUserRole,
  verifyResetToken,
  determineUserRole,
};
