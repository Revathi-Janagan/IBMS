const connection = require("../../Helper/db");
const fs = require("fs");
const upload = require("../../Config/multerConfig");

module.exports = (req, res) => {
  const customerId = req.params.customerId;
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

  // Other fields and variables...

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if the customer exists
    const checkCustomerSQL = `
      SELECT * FROM Customers WHERE customer_id = ?
    `;

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

      // Handle profile_pic update if a new profile picture is provided
      if (req.files["profile_pic"]) {
        const profilePicFile = req.files["profile_pic"][0];
        if (profilePicFile) {
          const profilePicFileName = profilePicFile.filename;

          // Remove the old profile picture from the file system (if applicable)
          connection.query(
            "SELECT profile_pic FROM Customers WHERE customer_id = ?",
            [customerId],
            (err, rows) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res.status(500).send({ message: "Internal Error", error: err });
                });
                return;
              }

              if (rows && rows.length > 0) {
                const oldProfilePicFileName = rows[0].profile_pic;

                if (oldProfilePicFileName) {
                  fs.unlink(`uploads/images/${oldProfilePicFileName}`, (err) => {
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
                  });
                }
              }

              // Update the profile_pic in the Customers table
              connection.query(
                "UPDATE Customers SET profile_pic = ? WHERE customer_id = ?",
                [profilePicFileName, customerId],
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

                  // Continue with updating other customer information
                  updateCustomerInfo();
                }
              );
            }
          );
        } else {
          updateCustomerInfo();
        }
      } else {
        updateCustomerInfo();
      }
    });
  });

  function updateCustomerInfo() {
    // Update the BusinessInfo table
    const updateBusinessInfoSQL = `
      UPDATE BusinessInfo
      SET
        business_place=?,
        district=?,
        language=?
      WHERE customer_id=?
    `;

    const businessInfoValues = [business_place, district, language, customerId];

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
        UPDATE ContactDetails
        SET
          business_number=?,
          email=?
        WHERE customer_id=?
      `;

      const contactDetailsValues = [business_number, email, customerId];

      connection.query(updateContactDetailsSQL, contactDetailsValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
          return;
        }

        // Update the OwnerDetails table
        const updateOwnerDetailsSQL = `
          UPDATE OwnerDetails
          SET
            phone_number=?
          WHERE customer_id=?
        `;

        const ownerDetailsValues = [phone_number, customerId];

        connection.query(updateOwnerDetailsSQL, ownerDetailsValues, (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
            return;
          }

          // Update the SocialMediaLinks table
          const updateSocialMediaLinksSQL = `
            UPDATE SocialMediaLinks
            SET
              facebook=?,
              instagram=?,
              youtube=?,
              linkedin=?,
              twitter=?
            WHERE customer_id=?
          `;

          const socialMediaLinkValues = [
            facebook,
            instagram,
            youtube,
            linkedin,
            twitter,
            customerId,
          ];

          connection.query(updateSocialMediaLinksSQL, socialMediaLinkValues, (err) => {
            if (err) {
              console.error(err);
              connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
              return;
            }

            // Update the Website table
            const updateWebsiteSQL = `
              UPDATE Website
              SET
                website_address=?
              WHERE customer_id=?
            `;

            const websiteValues = [website_address, customerId];

            connection.query(updateWebsiteSQL, websiteValues, (err) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res.status(500).send({ message: "Internal Error", error: err });
                });
                return;
              }

              // Continue with updating other customer information (the existing code structure)
              // ...

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error(err);
                  res.status(500).send({ message: "Internal Error" });
                  return;
                }

                // Transaction was successful, send a response to the client
                res.status(200).send({
                  message: `Customer ${customer_name} updated successfully`,
                  customer_id: customerId,
                });
              });
            });
          });
        });
      });
    });
  }
};
