const connection = require("../../Helper/db");
const upload = require("../../Config/multerConfig");

module.exports = (req, res) => {
  const customerId = req.params.customerId; // Assuming the customer ID is provided as a URL parameter
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
    facebook,
    instagram,
    youtube,
    linkedin,
    twitter,
    website_address,
  } = req.body;

  // Create objects containing the fields to update in each respective table
  const updatedCustomer = {
    customer_name,
    business_name,
    business_type,
    business_category,
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
    facebook,
    instagram,
    youtube,
    linkedin,
    twitter,
  };

  const updatedWebsite = {
    website_address,
  };

  // Handle image and document uploads using multer middleware
  upload.fields([
    { name: "profile_pic", maxCount: 1 }, // Handle image uploads
    { name: "document", maxCount: 1 }, // Handle document uploads
  ])(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if an image was uploaded
    if (req.files["profile_pic"] && req.files["profile_pic"][0]) {
      const userImage = req.files["profile_pic"][0].filename;
      updatedCustomer.profile_pic = userImage;
    }

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
        (err) => {
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
                  res
                    .status(500)
                    .send({ message: "Internal Error", error: err });
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
                      res
                        .status(500)
                        .send({ message: "Internal Error", error: err });
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
                          res
                            .status(500)
                            .send({ message: "Internal Error", error: err });
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
                              res.status(500).send({
                                message: "Internal Error",
                                error: err,
                              });
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
                                  res.status(500).send({
                                    message: "Internal Error",
                                    error: err,
                                  });
                                });
                              }

                              if (
                                req.files["document"] &&
                                req.files["document"][0]
                              ) {
                                const { originalname, buffer } =
                                  req.files["document"][0];

                                // Create an object to hold the updated file content
                                const updatedFileContent = {
                                  file_content: buffer,
                                };

                                // Perform an UPDATE statement to update the file content
                                connection.query(
                                  "UPDATE UploadedFiles SET ? WHERE file_id = ? AND customer_id = ?",
                                  [updatedFileContent, fileId, customerId],
                                  (err, result) => {
                                    if (err) {
                                      console.error(err);
                                      return connection.rollback(() => {
                                        res.status(500).json({
                                          message: "Internal Error",
                                          error: err,
                                        });
                                      });
                                    }

                                    // Handle the update success or provide an appropriate response to the client
                                    res.status(200).json({
                                      message: "File updated successfully",
                                      fileId: fileId,
                                      customerId: customerId,
                                    });

                                    // Commit the transaction
                                    connection.commit((err) => {
                                      if (err) {
                                        console.error(err);
                                        res.status(500).send({
                                          message: "Internal Error",
                                          error: err,
                                        });
                                      } else {
                                        // Transaction was successful, send a response to the client
                                        res.status(200).send({
                                          message: `Customer ${customer_name} updated successfully`,
                                          customer_id: customerId,
                                        });
                                      }
                                    });
                                  }
                                );
                              } else {
                                // Commit the transaction when there's no document to update
                                connection.commit((err) => {
                                  if (err) {
                                    console.error(err);
                                    res.status(500).send({
                                      message: "Internal Error",
                                      error: err,
                                    });
                                  } else {
                                    // Transaction was successful, send a response to the client
                                    res.status(200).send({
                                      message: `Customer ${customer_name} updated successfully`,
                                      customer_id: customerId,
                                    });
                                  }
                                });
                              }
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
  });
};
