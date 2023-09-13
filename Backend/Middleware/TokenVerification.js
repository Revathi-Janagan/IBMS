const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN, RESET_ACCESS_TOKEN } = require("../Config/config");
const connection = require("../Helper/db");

// Middleware for verifying tokens
module.exports.verifySuperAdmin  = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  const options = {
    expiresIn: "12h",
  };

  if (!token) {
    return res.status(400).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, ACCESS_TOKEN, options, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid Token" });
    }
    const userRole = decoded.role;

    // Check the user's role and apply different access controls
    if (userRole === "superadmin") {
      // User is a superadmin, allow specific access
      req.user = decoded;
      next();
    } else if (userRole === "admin") {
      // User is an admin, allow different access
      req.user = decoded;
      next();
    } else {
      // User is not authorized, deny access
      return res.status(403).json({ error: "Permission denied" });
    }
  });
};

module.exports.verifyResetToken = (req, res, next) => {
  const { token } = req.body; // Assuming the token is passed as a body

  if (!token) {
    return res.status(400).send({ message: "Reset token is required" });
  }

  // Verify the reset token
  jwt.verify(token, RESET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset token", error: err });
    }

    // Attach the decoded token data to the request object for later use
    req.resetTokenData = decoded;

    next();
  });
};
