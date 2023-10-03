const connection = require("../../Helper/db");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { sendAdminRegisterEmail } = require("../../Helper/nodemailer");


module.exports = (req, res) => {
  const {
    name,
    experience,
    designation,
    education,
    isAdmin,
    dob,
    marital_status,
    gender,
    place,
    mobile_number,
    email,
    alternative_phone_number,
    physically_challenged,
    skills,
    experience_description,
    portfolio_url,
    github_url,
    password,
    fieldsToAdd,
  } = req.body;
  console.log(req.body);

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a profile picture" });
  }

  const userImage = req.file.filename;

  if (!Array.isArray(fieldsToAdd)) {
    return res.status(400).send({ message: "Invalid fieldsToAdd parameter" });
  }
  console.log("Before database query");
  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    const employeeValues = {
      name,
      userImage,
      experience,
      designation,
      education,
      isAdmin,
    };

    // Insert into the employees table
    connection.query(
      "INSERT INTO employees SET ?",
      employeeValues,
      (err, result) => {
        if (err) {
          console.error(err);
          return connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
        }

        const employeeId = result.insertId;

        // ...

        if (isAdmin) {
          // Hash the password
          bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
            }

            // Insert into the admin table with the hashed password
            const adminValues = {
              employee_id: employeeId,
              email,
              password: hashedPassword, // Use the hashed password
            };

            connection.query("INSERT INTO admin SET ?", adminValues, (err) => {
              if (err) {
                console.error(err);
                return connection.rollback(() => {
                  res
                    .status(500)
                    .send({ message: "Internal Error", error: err });
                });
              }
              sendAdminRegisterEmail(email, password);
            });
          });
        }

        const personalInfoValues = {
          employee_id: employeeId,
          dob,
          marital_status,
          gender,
          place,
        };

        // Insert into the personal_information table
        connection.query(
          "INSERT INTO personal_information SET ?",
          personalInfoValues,
          (err) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error" });
              });
            }

            const contactDetailsValues = {
              employee_id: employeeId,
              mobile_number,
              email,
            };

            // Insert into the contact_details table
            connection.query(
              "INSERT INTO contact_details SET ?",
              contactDetailsValues,
              (err) => {
                if (err) {
                  console.error(err);
                  return connection.rollback(() => {
                    res.status(500).send({ message: "Internal Error" });
                  });
                }

                const extraInfoValues = {
                  employee_id: employeeId,
                  alternative_phone_number,
                  physically_challenged,
                };

                // Insert into the extra_information table
                connection.query(
                  "INSERT INTO extra_information SET ?",
                  extraInfoValues,
                  (err) => {
                    if (err) {
                      console.error(err);
                      return connection.rollback(() => {
                        res.status(500).send({ message: "Internal Error" });
                      });
                    }

                    // Insert skills into employee_skills table
                    if (Array.isArray(skills) && skills.length > 0) {
                      const skillInsertPromises = skills.map((skillName) => {
                        return new Promise((resolve, reject) => {
                          // Check if the skill already exists
                          connection.query(
                            "SELECT skill_id FROM skills WHERE skill_name = ?",
                            [skillName],
                            (err, skillResult) => {
                              if (err) {
                                console.error(err);
                                reject(err);
                              } else if (skillResult.length > 0) {
                                // Skill exists, use its skill_id
                                const skillId = skillResult[0].skill_id;
                                const skillValues = {
                                  employee_id: employeeId,
                                  skill_id: skillId,
                                };

                                // Insert into the employee_skills table
                                connection.query(
                                  "INSERT INTO employee_skills SET ?",
                                  skillValues,
                                  (err) => {
                                    if (err) {
                                      console.error(err);
                                      reject(err);
                                    } else {
                                      resolve();
                                    }
                                  }
                                );
                              } else {
                                // Skill doesn't exist, insert it into the skills table
                                const newSkillValues = {
                                  skill_name: skillName,
                                };

                                // Insert into the skills table
                                connection.query(
                                  "INSERT INTO skills SET ?",
                                  newSkillValues,
                                  (err, newSkillResult) => {
                                    if (err) {
                                      console.error(err);
                                      reject(err);
                                    } else {
                                      const skillId = newSkillResult.insertId;
                                      const skillValues = {
                                        employee_id: employeeId,
                                        skill_id: skillId,
                                      };

                                      // Insert into the employee_skills table
                                      connection.query(
                                        "INSERT INTO employee_skills SET ?",
                                        skillValues,
                                        (err) => {
                                          if (err) {
                                            console.error(err);
                                            reject(err);
                                          } else {
                                            resolve();
                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        });
                      });

                      Promise.all(skillInsertPromises)
                        .then(() => {
                          // Insert into the experience table
                          const experienceValues = {
                            employee_id: employeeId,
                            experience_description,
                          };

                          connection.query(
                            "INSERT INTO experience SET ?",
                            experienceValues,
                            (err) => {
                              if (err) {
                                console.error(err);
                                return connection.rollback(() => {
                                  res.status(500).send({
                                    message: "Internal Error",
                                  });
                                });
                              }

                              // Insert into the projects table
                              const projectsValues = {
                                employee_id: employeeId,
                                portfolio_url,
                                github_url,
                              };

                              connection.query(
                                "INSERT INTO projects SET ?",
                                projectsValues,
                                (err) => {
                                  if (err) {
                                    console.error(err);
                                    return connection.rollback(() => {
                                      res.status(500).send({
                                        message: "Internal Error",
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
                                        message: `Employee ${name} created successfully`,
                                        employee_id: employeeId,
                                      });
                                    }
                                  });
                                }
                              );
                            }
                          );
                        })
                        .catch((err) => {
                          console.error(err);
                          return connection.rollback(() => {
                            res.status(500).send({ message: "Internal Error" });
                          });
                        });
                    } else {
                      // No skills to insert, proceed to the next step
                      // Insert into the experience table
                      const experienceValues = {
                        employee_id: employeeId,
                        experience_description,
                      };

                      connection.query(
                        "INSERT INTO experience SET ?",
                        experienceValues,
                        (err) => {
                          if (err) {
                            console.error(err);
                            return connection.rollback(() => {
                              res
                                .status(500)
                                .send({ message: "Internal Error" });
                            });
                          }

                          // Insert into the projects table
                          const projectsValues = {
                            employee_id: employeeId,
                            portfolio_url,
                            github_url,
                          };

                          connection.query(
                            "INSERT INTO projects SET ?",
                            projectsValues,
                            (err) => {
                              if (err) {
                                console.error(err);
                                return connection.rollback(() => {
                                  res
                                    .status(500)
                                    .send({ message: "Internal Error" });
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
                                  // res.status(200).send({
                                  //   message: `Employee ${name} created successfully`,
                                  //   employee_id: employeeId,
                                  // });
                                  console.log(
                                    "EmployeeId before selecting profile:",
                                    employeeId
                                  );
                                  connection.query(
                                    "SELECT * FROM employees WHERE employee_id = ?",
                                    [employeeId],
                                    (err, employeeResult) => {
                                      if (err) {
                                        console.error(err);
                                        res
                                          .status(500)
                                          .send({ message: "Internal Error" });
                                      } else if (employeeResult.length > 0) {
                                        // Employee profile retrieved successfully, log it to the console
                                        const employeeProfile =
                                          employeeResult[0];
                                        console.log(
                                          "Employee Profile:",
                                          employeeProfile
                                        );

                                        // Send a response to the client
                                        res.status(200).send({
                                          message: `Employee ${name} created successfully`,
                                          employee_id: employeeId,
                                        });
                                        console.log("Before sending response");
                                        console.log(
                                          "Employee Profile Created successfully"
                                        );
                                      } else {
                                        // Employee not found
                                        res.status(404).send({
                                          message: "Employee not found",
                                        });
                                      }
                                    }
                                  );
                                }
                              });
                            }
                          );
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
  });
};
