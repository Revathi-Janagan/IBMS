const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const customerId = req.params.customerId; // Assuming the customer ID is provided as a URL parameter

  // Check if the customer with the given ID exists
  const checkCustomerExistsSQL = `
    SELECT * FROM customers
    WHERE customer_id = ?
  `;

  connection.query(checkCustomerExistsSQL, [customerId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if there are no results (customer not found)
    if (results.length === 0) {
      return res.status(404).send({ message: `Customer with ID ${customerId} not found` });
    }

    // Customer exists, begin a transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error", error: err });
      }

      // Define SQL statements to delete from related tables
      const deleteBusinessInfoSQL = `
        DELETE FROM businessinfo
        WHERE customer_id = ?
      `;

      const deleteContactDetailsSQL = `
        DELETE FROM contactdetails
        WHERE customer_id = ?
      `;

      const deleteOwnerDetailsSQL = `
        DELETE FROM ownerdetails
        WHERE customer_id = ?
      `;

      const deleteSocialMediaLinksSQL = `
        DELETE FROM socialmedialinks
        WHERE customer_id = ?
      `;

      const deleteWebsiteSQL = `
        DELETE FROM website
        WHERE customer_id = ?
      `;

      const deleteUploadedFilesSQL = `
        DELETE FROM uploadedfiles
        WHERE customer_id = ?
      `;

      // Define SQL statement to delete from customers table
      const deleteCustomerSQL = `
        DELETE FROM customers
        WHERE customer_id = ?
      `;

      // Execute SQL delete statements in sequence
      connection.query(deleteBusinessInfoSQL, [customerId], (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
          return;
        }

        connection.query(deleteContactDetailsSQL, [customerId], (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
            return;
          }

          connection.query(deleteOwnerDetailsSQL, [customerId], (err) => {
            if (err) {
              console.error(err);
              connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
              return;
            }

            connection.query(deleteSocialMediaLinksSQL, [customerId], (err) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res.status(500).send({ message: "Internal Error", error: err });
                });
                return;
              }

              connection.query(deleteWebsiteSQL, [customerId], (err) => {
                if (err) {
                  console.error(err);
                  connection.rollback(() => {
                    res.status(500).send({ message: "Internal Error", error: err });
                  });
                  return;
                }

                connection.query(deleteUploadedFilesSQL, [customerId], (err) => {
                  if (err) {
                    console.error(err);
                    connection.rollback(() => {
                      res.status(500).send({ message: "Internal Error", error: err });
                    });
                    return;
                  }

                  // Finally, delete the customer from the customers table
                  connection.query(deleteCustomerSQL, [customerId], (err) => {
                    if (err) {
                      console.error(err);
                      connection.rollback(() => {
                        res.status(500).send({ message: "Internal Error", error: err });
                      });
                      return;
                    }

                    // Commit the transaction
                    connection.commit((err) => {
                      if (err) {
                        console.error(err);
                        res.status(500).send({ message: "Internal Error", error: err });
                        return;
                      }

                      // Transaction was successful, send a response to the client
                      res.status(200).send({
                        message: `Customer with ID ${customerId} deleted successfully`,
                      });
                      console.log(`Customer with ID ${customerId} deleted successfully`);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
