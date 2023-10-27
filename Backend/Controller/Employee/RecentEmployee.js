const connection = require("../../Helper/db");

// Define a route to get the list of customers with image, name, and business type
module.exports = (req, res) => {
    // SQL query to select customer details
    //  const getemployeesQuery = "SELECT profile_pic, name, designation FROM employees";
   const getemployeesQuery = "SELECT profile_pic, name, designation FROM employees ORDER BY employee_id DESC LIMIT 2";


    // Execute the SQL query
    connection.query(getemployeesQuery, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal Error", error: err });
        }

        // Send the customer data to the frontend
        res.status(200).send(results);
    });
};
