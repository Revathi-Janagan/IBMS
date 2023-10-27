const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const customerId = req.params.id; // Assuming the customer ID is passed as a route parameter
  console.log("Requested Customer ID:", customerId);

  // Query to retrieve the complete profile of a customer with the specified customer_id
  const sql = `
  SELECT
  c.customer_id,
  c.customer_name,
  c.business_name,
  c.business_type,
  c.business_category,
  bi.business_place,
  bi.district,
  bi.language,
  cd.business_number,
  cd.email,
  od.phone_number,
  sml.facebook,
  sml.instagram,
  sml.youtube,
  sml.linkedin,
  sml.twitter,
  w.website_address,
  uf.file_name,  
  c.profile_pic
FROM Customers c
LEFT JOIN BusinessInfo bi ON c.customer_id = bi.customer_id
LEFT JOIN ContactDetails cd ON c.customer_id = cd.customer_id
LEFT JOIN OwnerDetails od ON c.customer_id = od.customer_id
LEFT JOIN SocialMediaLinks sml ON c.customer_id = sml.customer_id
LEFT JOIN Website w ON c.customer_id = w.customer_id
LEFT JOIN UploadedFiles uf ON c.customer_id = uf.customer_id
WHERE c.customer_id = ?
  `;

  // Execute the SQL query with the customer ID as a parameter
  connection.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    if (results.length === 0) {
      // Customer not found
      return res.status(404).send({ message: "Customer not found" });
    }

    // Return the customer profile as JSON (the first result from the query)
    res.status(200).json({ customer: results[0] });
  });
};
