const connection = require("../../Helper/db");
const fs = require("fs");
const upload = require("../../Config/multerConfig");

module.exports = (req, res) => {
  const customerId = req.params.id;
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
  let profile_pic;
  console.log(req.files);
  let document;
  if (req.files && req.files["document"] && req.files["document"][9]) {
    document = req.files["document"][0].filename;
    console.log("Document is ", document);
  } else {
    console.log("Document not provided");
  }
  if (req.files && req.files["profile_pic"] && req.files["profile_pic"][0]) {
    profile_pic = req.files["profile_pic"][0].filename;
    console.log("profile_pic", profile_pic);
  } else {
    console.error("profile_pic is not provided in the request.");
  }

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if the customer exists
    const checkCustomerSQL = `
      SELECT * FROM customers WHERE customer_id = ?`;

    connection.query(checkCustomerSQL, [customerId], (err, customerResult) => {
      if (err) {
        console.error(err);
        connection.rollback(() => {
          res.status(500).send({ message: "Internal Error", error: err });
        });
        return;
      }

      if (customerResult.length === 0) {
        // Customer not found
        connection.rollback(() => {
          res.status(404).send({ message: "Customer not found" });
        });
        return;
      }

      const updateCustomerInfoSQL = `
      UPDATE customers
      SET  
      customer_name = ?,
      profile_pic = ?,
      business_name = ?,
      business_type = ?,
      business_category = ?
      WHERE customer_id = ?
    `;

      const customerInfoValues = [
        customer_name,
        profile_pic,
        business_name,
        business_type,
        business_category,
        customerId,
      ];

      connection.query(updateCustomerInfoSQL, customerInfoValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
          return;
        }

        // Update the BusinessInfo table
        const updateBusinessInfoSQL = `
          UPDATE businessinfo
          SET     
          business_place = ?,
          district = ?,
          language = ?
          WHERE customer_id = ?
        `;

        const businessInfoValues = [
          business_place,
          district,
          language,
          customerId,
        ];

        connection.query(updateBusinessInfoSQL, businessInfoValues, (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
            return;
          }

          // Update the ContactDetails table
          const updateContactDetailsSQL = `
            UPDATE contactdetails
            SET
            business_number = ?,
            email = ?
            WHERE customer_id = ?
          `;

          const contactDetailsValues = [business_number, email, customerId];

          connection.query(
            updateContactDetailsSQL,
            contactDetailsValues,
            (err) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res
                    .status(500)
                    .send({ message: "Internal Error", error: err });
                });
                return;
              }

              // Update the OwnerDetails table
              const updateOwnerDetailsSQL = `
              UPDATE ownerdetails
              SET
              phone_number = ?
              WHERE customer_id = ?
            `;

              const ownerDetailsValues = [phone_number, customerId];

              connection.query(
                updateOwnerDetailsSQL,
                ownerDetailsValues,
                (err) => {
                  if (err) {
                    console.error(err);
                    connection.rollback(() => {
                      res
                        .status(500)
                        .send({ message: "Internal Error", error: err });
                    });
                    return;
                  }

                  // Update the SocialMediaLinks table
                  const updateSocialMediaLinksSQL = `
                UPDATE socialmedialinks
                SET
                facebook = ?,
                instagram = ?,
                youtube = ?,
                linkedin = ?,
                twitter = ?
                WHERE customer_id = ?
              `;

                  const socialMediaLinkValues = [
                    facebook,
                    instagram,
                    youtube,
                    linkedin,
                    twitter,
                    customerId,
                  ];

                  connection.query(
                    updateSocialMediaLinksSQL,
                    socialMediaLinkValues,
                    (err) => {
                      if (err) {
                        console.error(err);
                        connection.rollback(() => {
                          res
                            .status(500)
                            .send({ message: "Internal Error", error: err });
                        });
                        return;
                      }

                      // Update the Website table
                      const updateWebsiteSQL = `
                  UPDATE website
                  SET
                  website_address = ?
                  WHERE customer_id = ?
                `;

                      const websiteValues = [website_address, customerId];

                      connection.query(
                        updateWebsiteSQL,
                        websiteValues,
                        (err) => {
                          if (err) {
                            console.error(err);
                            connection.rollback(() => {
                              res.status(500).send({
                                message: "Internal Error",
                                error: err,
                              });
                            });
                            return;
                          }

                          // Commit the transaction
                          connection.commit((err) => {
                            if (err) {
                              console.error(err);
                              res
                                .status(500)
                                .send({ message: "Internal Error" });
                              return;
                            }

                            // Continue with the rest of the customer update logic, including the document file update
                            const newDocumentFile = req.files["document"];
                            console.log("newDocument", newDocumentFile);
                            if (newDocumentFile) {
                              const newDocumentFileName =
                                newDocumentFile[0].originalname;

                              console.log("After if", newDocumentFileName);

                              // Read the content of the new document file using fs module
                              const newDocumentContentBuffer = fs.readFileSync(
                                newDocumentFile[0].path
                              );

                              // Update the existing document in the UploadedFiles table
                              const updateUploadedFileSQL = `
                        UPDATE uploadedfiles
                        SET file_name = ?                        
                        WHERE customer_id = ?
                      `;
                              const updateUploadedFileValues = [
                                newDocumentFileName,
                                customerId,
                              ];

                              connection.query(
                                updateUploadedFileSQL,
                                updateUploadedFileValues,
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

                                  // Transaction was successful, send a response to the client
                                  res.status(200).send({
                                    message: `Customer ${customer_name} updated successfully`,
                                    customer_id: customerId,
                                  });
                                }
                              );
                            }
                          });
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
    });
  });
};
