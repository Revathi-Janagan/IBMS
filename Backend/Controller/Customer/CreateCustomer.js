const connection = require("../../Helper/db");
const { uploadImage, uploadDocument } = require("./multerConfig");

module.exports = (req, res) => {
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
  } = req.body;

  // Check if an image was uploaded
  let userImage = null;
  if (req.file) {
    userImage = req.file.filename;
  }

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    const customerValues = {
      customer_name,
      business_name,
      business_type,
      business_category,
      profile_pic: userImage,
    };

    // Insert into the Customers table
    connection.query(
      "INSERT INTO Customers SET ?",
      customerValues,
      (err, result) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
        }

        const customerId = result.insertId;

        // Insert into the BusinessInfo table
        const businessInfoValues = {
          customer_id: customerId,
          business_place,
          district,
          language,
        };

        connection.query(
          "INSERT INTO BusinessInfo SET ?",
          businessInfoValues,
          (err) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
            }

            // Insert into the ContactDetails table
            const contactDetailsValues = {
              customer_id: customerId,
              business_number,
              email,
            };

            connection.query(
              "INSERT INTO ContactDetails SET ?",
              contactDetailsValues,
              (err) => {
                if (err) {
                  console.error(err);
                  return connection.rollback(() => {
                    res
                      .status(500)
                      .send({ message: "Internal Error", error: err });
                  });
                }

                // Insert into the OwnerDetails table
                const ownerDetailsValues = {
                  customer_id: customerId,
                  phone_number,
                };

                connection.query(
                  "INSERT INTO OwnerDetails SET ?",
                  ownerDetailsValues,
                  (err) => {
                    if (err) {
                      console.error(err);
                      return connection.rollback(() => {
                        res
                          .status(500)
                          .send({ message: "Internal Error", error: err });
                      });
                    }

                    // Insert into the SocialMediaLinks table
                    const socialMediaLinkValues = {
                      customer_id: customerId,
                      social_media_link,
                    };

                    connection.query(
                      "INSERT INTO SocialMediaLinks SET ?",
                      socialMediaLinkValues,
                      (err) => {
                        if (err) {
                          console.error(err);
                          return connection.rollback(() => {
                            res
                              .status(500)
                              .send({ message: "Internal Error", error: err });
                          });
                        }

                        // Insert into the Website table
                        const websiteValues = {
                          customer_id: customerId,
                          website_address,
                        };

                        connection.query(
                          "INSERT INTO Website SET ?",
                          websiteValues,
                          (err) => {
                            if (err) {
                              console.error(err);
                              return connection.rollback(() => {
                                res
                                  .status(500)
                                  .send({
                                    message: "Internal Error",
                                    error: err,
                                  });
                              });
                            }

                            // Check if a document was uploaded
                            if (req.file) {
                              const { originalname, buffer } = req.file;

                              // Insert the uploaded document into the UploadedFiles table
                              const uploadedFileValues = {
                                customer_id: customerId,
                                file_name: originalname,
                                file_content: buffer,
                              };

                              connection.query(
                                "INSERT INTO UploadedFiles SET ?",
                                uploadedFileValues,
                                (err) => {
                                  if (err) {
                                    console.error(err);
                                    return connection.rollback(() => {
                                      res
                                        .status(500)
                                        .send({
                                          message: "Internal Error",
                                          error: err,
                                        });
                                    });
                                  }

                                  // Commit the transaction
                                  connection.commit((err) => {
                                    if (err) {
                                      console.error(err);
                                      res
                                        .status(500)
                                        .send({ message: "Internal Error" });
                                    } else {
                                      // Transaction was successful, send a response to the client
                                      res.status(200).send({
                                        message: `Customer ${customer_name} created successfully`,
                                        customer_id: customerId,
                                      });
                                    }
                                  });
                                }
                              );
                            } else {
                              // If no document was uploaded, commit the transaction directly
                              connection.commit((err) => {
                                if (err) {
                                  console.error(err);
                                  res
                                    .status(500)
                                    .send({ message: "Internal Error" });
                                } else {
                                  // Transaction was successful, send a response to the client
                                  res.status(200).send({
                                    message: `Customer ${customer_name} created successfully`,
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
};
