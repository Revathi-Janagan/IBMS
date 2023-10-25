const connection = require("../../Helper/db");

// Define a route to get the list of admin employees
module.exports= (req, res) => {
    // SQL query to select admin employees
    const getAdminsQuery = "SELECT name, designation, profile_pic FROM employees WHERE isAdmin = 1";

    // Execute the SQL query
    connection.query(getAdminsQuery, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error", error: err });
      }

      // Send the admin data to the frontend
      res.status(200).send(results);
    });
  };

