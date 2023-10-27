const connection = require("../../Helper/db");

// Define a route to get the list of customers with image, name, and business type
module.exports = (req, res) => {
    // SQL query to select customer details
     const getcustomersQuery = "SELECT profile_pic, customer_name, business_name FROM customers ORDER BY customer_id DESC LIMIT 2";
    // const getcustomersQuery = "SELECT profile_pic, customer_name, business_name FROM customers ORDER BY created_at DESC LIMIT 4";


    // Execute the SQL query
    connection.query(getcustomersQuery, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Internal Error", error: err });
        }

        // Send the customer data to the frontend
        res.status(200).send(results);
    });
};
