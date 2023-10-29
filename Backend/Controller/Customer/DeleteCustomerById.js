const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const customerId = req.params.customerId; // Assuming the customer ID is provided as a URL parameter

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Delete the customer and related data from all tables using cascading delete
    connection.query(
      "DELETE customers, businessinfo, contactdetails, ownerdetails, socialmedialinks, website, uploadedfiles " +
      "FROM customers " +
      "LEFT JOIN businessinfo ON customers.customer_id = businessinfo.customer_id " +
      "LEFT JOIN contactdetails ON customers.customer_id = contactdetails.customer_id " +
      "LEFT JOIN ownerdetails ON customers.customer_id = ownerdetails.customer_id " +
      "LEFT JOIN socialmedialinks ON customers.customer_id = socialmedialinks.customer_id " +
      "LEFT JOIN website ON customers.customer_id = website.customer_id " +
      "LEFT JOIN uploadedfiles ON customers.customer_id = uploadedfiles.customer_id " +
      "WHERE customers.customer_id = ?",
      [customerId],
      (err, result) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
        }

        // Commit the transaction
        connection.commit((err) => {
          if (err) {
            console.error(err);
            return connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
          }

          // Transaction was successful, send a response to the client
          res.status(200).send({ message: `Customer profile deleted successfully ${customerId}` });
        });
      }
    );
  });
};
