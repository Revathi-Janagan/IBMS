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
      "DELETE Customers, BusinessInfo, ContactDetails, OwnerDetails, SocialMediaLinks, Website, FileUploads " +
      "FROM Customers " +
      "LEFT JOIN BusinessInfo ON Customers.customer_id = BusinessInfo.customer_id " +
      "LEFT JOIN ContactDetails ON Customers.customer_id = ContactDetails.customer_id " +
      "LEFT JOIN OwnerDetails ON Customers.customer_id = OwnerDetails.customer_id " +
      "LEFT JOIN SocialMediaLinks ON Customers.customer_id = SocialMediaLinks.customer_id " +
      "LEFT JOIN Website ON Customers.customer_id = Website.customer_id " +
      "LEFT JOIN FileUploads ON Customers.customer_id = FileUploads.customer_id " +
      "WHERE Customers.customer_id = ?",
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
            res.status(500).send({ message: "Internal Error", error: err });
          } else {
            // Transaction was successful, send a response to the client
            res.status(200).send({ message: "Customer profile deleted successfully" });
          }
        });
      }
    );
  });
};
