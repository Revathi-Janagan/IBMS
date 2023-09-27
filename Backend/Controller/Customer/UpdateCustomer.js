const connection = require("../../Helper/db");
const { uploadImage, uploadDocument } = require("./multerConfig");

module.exports = (req, res) => {
  const customerId = req.params.customerId; // Assuming the customer ID is provided as a URL parameter

  // Extract the fields you want to update from the request body
  const {
    customer_name,
    business_name,
    business_type,
    business_category,
    business_place,
    district,
    language,
    business_number,
    email,
    phone_number,
    social_media_link,
    website_address,
    profile_pic,
  } = req.body;

  // Create objects containing the fields to update in each table
  const updatedCustomer = {
    customer_name,
    business_name,
    business_type,
    business_category,
    profile_pic,
  };

  const updatedBusinessInfo = {
    business_place,
    district,
    language,
  };

  const updatedContactDetails = {
    business_number,
    email,
  };

  const updatedOwnerDetails = {
    phone_number,
  };

  const updatedSocialMediaLinks = {
    social_media_link,
  };

  const updatedWebsite = {
    website_address,
  };

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Update the customer information in the Customers table
    connection.query(
      "UPDATE Customers SET ? WHERE customer_id = ?",
      [updatedCustomer, customerId],
      (err, result) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
        }

        // Update the BusinessInfo table
        connection.query(
          "UPDATE BusinessInfo SET ? WHERE customer_id = ?",
          [updatedBusinessInfo, customerId],
          (err) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
            }

            // Update the ContactDetails table
            connection.query(
              "UPDATE ContactDetails SET ? WHERE customer_id = ?",
              [updatedContactDetails, customerId],
              (err) => {
                if (err) {
                  console.error(err);
                  return connection.rollback(() => {
                    res.status(500).send({ message: "Internal Error", error: err });
                  });
                }

                // Update the OwnerDetails table
                connection.query(
                  "UPDATE OwnerDetails SET ? WHERE customer_id = ?",
                  [updatedOwnerDetails, customerId],
                  (err) => {
                    if (err) {
                      console.error(err);
                      return connection.rollback(() => {
                        res.status(500).send({ message: "Internal Error", error: err });
                      });
                    }

                    // Update the SocialMediaLinks table
                    connection.query(
                      "UPDATE SocialMediaLinks SET ? WHERE customer_id = ?",
                      [updatedSocialMediaLinks, customerId],
                      (err) => {
                        if (err) {
                          console.error(err);
                          return connection.rollback(() => {
                            res.status(500).send({ message: "Internal Error", error: err });
                          });
                        }

                        // Update the Website table
                        connection.query(
                          "UPDATE Website SET ? WHERE customer_id = ?",
                          [updatedWebsite, customerId],
                          (err) => {
                            if (err) {
                              console.error(err);
                              return connection.rollback(() => {
                                res.status(500).send({ message: "Internal Error", error: err });
                              });
                            }

                            // Check if an image was uploaded
                            uploadImage.single("profile_pic")(req, res, (err) => {
                              if (err) {
                                console.error(err);
                                return connection.rollback(() => {
                                  res.status(400).send({
                                    message: "Image upload failed",
                                    error: err,
                                  });
                                });
                              }

                              // Check if a document was uploaded
                              uploadDocument.single("file_content")(req, res, (err) => {
                                if (err) {
                                  console.error(err);
                                  return connection.rollback(() => {
                                    res.status(400).send({
                                      message: "Document upload failed",
                                      error: err,
                                    });
                                  });
                                }

                                // Commit the transaction
                                connection.commit((err) => {
                                  if (err) {
                                    console.error(err);
                                    res.status(500).send({ message: "Internal Error", error: err });
                                  } else {
                                    // Transaction was successful, send a response to the client
                                    res.status(200).send({
                                      message: `Customer ${customer_name} updated successfully`,
                                      customer_id: customerId,
                                    });
                                  }
                                });
                              });
                            });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};
