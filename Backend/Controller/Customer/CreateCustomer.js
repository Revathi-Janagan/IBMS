const connection = require("../../Helper/db");

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
    facebook,
    instagram,
    youtube,
    linkedin,
    twitter,
    website_address,
  } = req.body;

  const profile_pic = req.files["profile_pic"][0].filename;
  console.log(profile_pic);

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
      profile_pic,
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
                    res.status(500).send({ message: "Internal Error", error: err });
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
                        res.status(500).send({ message: "Internal Error", error: err });
                      });
                    }

                    // Insert into the SocialMediaLinks table
                    const socialMediaLinkValues = {
                      customer_id: customerId,
                      facebook,
                      instagram,
                      youtube,
                      linkedin,
                      twitter,
                    };

                    connection.query(
                      "INSERT INTO SocialMediaLinks SET ?",
                      socialMediaLinkValues,
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
                                res.status(500).send({
                                  message: "Internal Error",
                                  error: err,
                                });
                              });
                            }

                            // Check if a document was uploaded
                            const documentFile = req.files["document"];
                            if (documentFile) {
                              const documentFileName = documentFile[0].filename;
                              // Now you can safely access the filename.
                              console.log(documentFileName);
                              const fs = require("fs");
                              const contentBuffer = fs.readFileSync(documentFile[0].path);

                              // Insert the uploaded document into the UploadedFiles table
                              const uploadedFileValues = {
                                customer_id: customerId,
                                file_name: documentFileName,
                                file_content: contentBuffer,
                              };
                              // You need to read the content of the uploaded file using fs module.
                              connection.query(
                                "INSERT INTO UploadedFiles SET ?",
                                uploadedFileValues,
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

                                  // Commit the transaction
                                  connection.commit((err) => {
                                    if (err) {
                                      console.error(err);
                                      res.status(500).send({ message: "Internal Error" });
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
