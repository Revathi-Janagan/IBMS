const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const employeeId = req.params.id;
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
  } = req.body;

  const isAdminValue = isAdmin === 'Yes' ? 1 : 0;
  let profile_pic; // Declare the profile_pic variable

  if (req.files["profile_pic"] && req.files["profile_pic"][0]) {
    profile_pic = req.files["profile_pic"][0].filename;
  } else {
    profile_pic = null; // Or provide a default value based on your requirements
  }
 
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
  profile_pic =?,
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
              const updateExtraInfoSQL = `
              UPDATE extra_information
              SET alternative_phone_number=?, physically_challenged=?
              WHERE employee_id=?
            `;

              const extraInfoValues = [
                alternative_phone_number,
                physically_challenged,
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

                // Delete existing skills for the employee
                const deleteSkillsSQL = `
              DELETE FROM employee_skills
              WHERE employee_id=?
            `;

                connection.query(deleteSkillsSQL, [employeeId], (err) => {
                  if (err) {
                    console.error(err);
                    connection.rollback(() => {
                      res
                        .status(500)
                        .send({ message: "Internal Error", error: err });
                    });
                    return;
                  }

                  // Insert updated skills for the employee
                  if (Array.isArray(skills) && skills.length > 0) {
                    const insertSkillsSQL = `
                  INSERT INTO employee_skills (employee_id, employee_skill_id)
                  VALUES (?, ?)
                `;

                    skills.forEach((skillName) => {
                      // Check if the skill already exists
                      const checkSkillSQL = `
                  SELECT employee_skill_id FROM employee_skills WHERE skill_name = ?
                `;

                      connection.query(
                        checkSkillSQL,
                        [skillName],
                        (err, skillResult) => {
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

                          let skillId;

                          if (skillResult.length > 0) {
                            // Skill exists, use its skill_id
                            skillId = skillResult[0].skill_id;
                          } else {
                            // Skill doesn't exist, insert it into the skills table
                            const insertNewSkillSQL = `
                          INSERT INTO employee_skills (skill_name)
                          VALUES (?)
                        `;

                            connection.query(
                              insertNewSkillSQL,
                              [skillName],
                              (err, newSkillResult) => {
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

                                skillId = newSkillResult.insertId;
                              }
                            );
                          }

                          // Insert into the employee_skills table
                          connection.query(
                            insertSkillsSQL,
                            [employeeId, skillId],
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
                            }
                          );
                        }
                      );
                    });
                  }

                  // Update the experience table
                  const updateExperienceSQL = `
                  UPDATE experience
                  SET experience_description=?
                  WHERE employee_id=?
                `;
                  const experienceValues = [experience_description, employeeId];
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
                });
              });
            }
          );
        });
      });
    });
  });
};
