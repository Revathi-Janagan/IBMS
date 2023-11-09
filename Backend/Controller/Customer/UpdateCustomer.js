const connection = require("../../Helper/db");
const fs = require("fs");

module.exports = (req, res) => {
  const customerId = req.params.id;
  const fileId = req.params.id;
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

  // Handle file uploads
  let profile_pic;
  if (req.files["profile_pic"] && req.files["profile_pic"][0]) {
    profile_pic = req.files["profile_pic"][0].filename;
  } else {
    // If no new image is selected, use the existing image (dynamically set it)
    profile_pic = req.body.profile_pic; // Assuming you include this in the request
  }

  let document;
  if (req.files) {
    if (req.files["document"] && req.files["document"][0]) {
      document = req.files["document"][0].filename;
    } else {
      document = req.body.document;
    }
  }
  console.log("Document is",document);

  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
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
                res.status(500).send({ message: "Internal Error", error: err });
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

                    connection.query(updateWebsiteSQL, websiteValues, (err) => {
                      if (err) {
                        console.error(err);
                        connection.rollback(() => {
                          res
                            .status(500)
                            .send({ message: "Internal Error", error: err });
                        });
                        return;
                      }

                      // Commit the transaction
                      connection.commit((err) => {
                        if (err) {
                          console.error(err);
                          res.status(500).send({ message: "Internal Error" });
                          return;
                        }

                        // Handle the document upload
                        if (document) {
                          // Update or insert the new document based on the 'customer_id'
                          const updateDocumentSQL = `
                      UPDATE uploadedfiles
                      SET
                      file_name = ?
                      WHERE customer_id = ?
                    `;
                          const updateDocumentValues = [document.originalname,customerId];

                          // Execute the SQL query to update the document in the database
                          connection.query(
                            updateDocumentSQL,
                            updateDocumentValues,
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
                                  res
                                    .status(500)
                                    .send({ message: "Internal Error" });
                                  return;
                                }

                                res.status(200).send({
                                  message: `Customer ${customer_name} updated successfully`,
                                  customer_id: customerId,
                                  file_id: fileId,
                                });
                              });
                            }
                          );
                        } else {
                          // No new document provided, simply commit the transaction
                          connection.commit((err) => {
                            if (err) {
                              console.error(err);
                              res
                                .status(500)
                                .send({ message: "Internal Error" });
                              return;
                            }

                            res.status(200).send({
                              message: `Customer ${customer_name} updated successfully`,
                              customer_id: customerId,
                            });
                          });
                        }
                      });
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};
