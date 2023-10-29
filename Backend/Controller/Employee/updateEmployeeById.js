const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const employeeId = req.params.id;
  const {
    name,
    profile_pic,
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
  } = req.body;
  console.log("Request body", req.body);

  const isAdminValue = isAdmin === "Yes" ? 1 : 0;

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    // Check if the employee exists
    const checkEmployeeSQL = `
      SELECT * FROM employees WHERE employee_id = ?
    `;

    connection.query(checkEmployeeSQL, [employeeId], (err, employeeResult) => {
      if (err) {
        console.error(err);
        connection.rollback(() => {
          res.status(500).send({ message: "Internal Error", error: err });
        });
        return;
      }

      if (employeeResult.length === 0) {
        // Employee not found
        connection.rollback(() => {
          res.status(404).send({ message: "Employee not found" });
        });
        return;
      }
      // Update the employees table
      const updateEmployeeSQL = `
UPDATE employees
SET
  name=?,
  profile_pic=?,
  experience=?,
  education=?,
  designation=?,
  isAdmin=?
WHERE employee_id=?
`;

      const employeeValues = [
        name,
        profile_pic,
        experience,
        education,
        designation,
        isAdminValue,
        employeeId,
      ];

      connection.query(updateEmployeeSQL, employeeValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error", error: err });
          });
          return;
        }
        if (isAdmin) {
          // Update the admin table with email, username, and password
          const updateAdminSQL = `
            UPDATE admin
            SET
              email=?,              
              password=?
            WHERE employee_id=?
          `;

          const adminValues = [email, password, employeeId];

          connection.query(updateAdminSQL, adminValues, (err) => {
            if (err) {
              console.error(err);
              connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
              return;
            }
          });
        }

        // Update the personal_information table

        const dobMySQLFormat = new Date(dob).toJSON().slice(0, 10);
        const updatePersonalInfoSQL = `
          UPDATE personal_information
          SET dob=?, marital_status=?, gender=?, place=?
          WHERE employee_id=?
        `;

        const personalInfoValues = [
          dobMySQLFormat,
          marital_status,
          gender,
          place,
          employeeId,
        ];

        connection.query(updatePersonalInfoSQL, personalInfoValues, (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
            return;
          }

          // Update the contact_details table
          const updateContactDetailsSQL = `
            UPDATE contact_details
            SET mobile_number=?, email=?
            WHERE employee_id=?
          `;

          const contactDetailsValues = [mobile_number, email, employeeId];

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

              // Update the extra_information table
              const physicallyChallengedInt =
                physically_challenged.toLowerCase() === "yes" ? 1 : 0;
              const updateExtraInfoSQL = `
              UPDATE extra_information
              SET alternative_phone_number=?, physically_challenged=?
              WHERE employee_id=?
            `;

              const extraInfoValues = [
                alternative_phone_number,
                physicallyChallengedInt,
                employeeId,
              ];

              connection.query(updateExtraInfoSQL, extraInfoValues, (err) => {
                if (err) {
                  console.error(err);
                  connection.rollback(() => {
                    res
                      .status(500)
                      .send({ message: "Internal Error", error: err });
                  });
                  return;
                }              
                // Fetch existing skills for the employee
                const fetchExistingSkillsSQL = `
        SELECT skill_name FROM employee_skills WHERE employee_id = ?
      `;

                connection.query(
                  fetchExistingSkillsSQL,
                  [employeeId],
                  (err, existingSkills) => {
                    if (err) {
                      console.error(err);
                      connection.rollback(() => {
                        res
                          .status(500)
                          .send({ message: "Internal Error", error: err });
                      });
                      return;
                    }

                    // Create an array of existing skill names
                    const existingSkillNames = existingSkills.map(
                      (skill) => skill.skill_name
                    );

                    // Identify new skills to add
                    const newSkills = skills.filter(
                      (skill) => !existingSkillNames.includes(skill)
                    );

                    // Identify skills to remove
                    const skillsToRemove = existingSkillNames.filter(
                      (skill) => !skills.includes(skill)
                    );

                    // Delete skills to remove
                    if (skillsToRemove.length > 0) {
                      const deleteSkillsSQL = `
            DELETE FROM employee_skills
            WHERE employee_id=? AND skill_name IN (?)
          `;

                      connection.query(
                        deleteSkillsSQL,
                        [employeeId, skillsToRemove],
                        (err) => {
                          if (err) {
                            console.error(err);
                            connection.rollback(() => {
                              res
                                .status(500)
                                .send({
                                  message: "Internal Error",
                                  error: err,
                                });
                            });
                            return;
                          }
                        }
                      );
                    }

                    // Insert new skills
                    if (newSkills.length > 0) {
                      const insertSkillsSQL = `
            INSERT INTO employee_skills (employee_id, skill_name)
            VALUES ? 
          `;

                      const newSkillsValues = newSkills.map((skill) => [
                        employeeId,
                        skill,
                      ]);

                      connection.query(
                        insertSkillsSQL,
                        [newSkillsValues],
                        (err) => {
                          if (err) {
                            console.error(err);
                            connection.rollback(() => {
                              res
                                .status(500)
                                .send({
                                  message: "Internal Error",
                                  error: err,
                                });
                            });
                            return;
                          }
                        }
                      );
                    }

                    // Update the experience table
                    const updateExperienceSQL = `
                  UPDATE experience
                  SET experience_description=?
                  WHERE employee_id=?
                `;
                    const experienceValues = [
                      experience_description,
                      employeeId,
                    ];
                    connection.query(
                      updateExperienceSQL,
                      experienceValues,
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

                        // Update the projects table
                        const updateProjectsSQL = `
                    UPDATE projects
                    SET portfolio_url=?, github_url=?
                    WHERE employee_id=?
                  `;

                        const projectsValues = [
                          portfolio_url,
                          github_url,
                          employeeId,
                        ];

                        connection.query(
                          updateProjectsSQL,
                          projectsValues,
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

                              // Transaction was successful, send a response to the client
                              res.status(200).send({
                                message: `Employee ${name} updated successfully`,
                                employee_id: employeeId,
                              });
                            });
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
        });
      });
    });
  });
};
