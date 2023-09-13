const connection = require("../../Helper/db");

module.exports = (req, res) => {
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

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error" ,error:err});
    }

    // Insert into the employees table
    const insertEmployeeSQL = `
      INSERT INTO employees (name, profile_pic, experience, designation, education, isAdmin)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const employeeValues = [
      name,
      profile_pic,
      experience,
      designation,
      education,
      isAdmin,
    ];

    connection.query(insertEmployeeSQL, employeeValues, (err, result) => {
      if (err) {
        console.error(err);
        connection.rollback(() => {
          res.status(500).send({ message: "Internal Error",error:err });
        });
        return;
      }

      const employeeId = result.insertId;

      if (isAdmin) {
        // Insert into the admin table with email, username, and password
        const insertAdminSQL = `
          INSERT INTO admin (employee_id, email, password)
          VALUES (?, ?, ?, ?)
        `;

        const adminValues = [employeeId, email,  password];

        connection.query(insertAdminSQL, adminValues, (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
            return;
          }
        });
      }


      // Insert into the personal_information table
      const insertPersonalInfoSQL = `
        INSERT INTO personal_information (employee_id, dob, marital_status, gender, place)
        VALUES (?, ?, ?, ?, ?)
      `;

      const personalInfoValues = [
        employeeId,
        dob,
        marital_status,
        gender,
        place,
      ];

      connection.query(insertPersonalInfoSQL, personalInfoValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error" });
          });
          return;
        }

        // Insert into the contact_details table
        const insertContactDetailsSQL = `
          INSERT INTO contact_details (employee_id, mobile_number, email)
          VALUES (?, ?, ?)
        `;

        const contactDetailsValues = [employeeId, mobile_number, email];

        connection.query(
          insertContactDetailsSQL,
          contactDetailsValues,
          (err) => {
            if (err) {
              console.error(err);
              connection.rollback(() => {
                res.status(500).send({ message: "Internal Error" });
              });
              return;
            }

            // Insert into the extra_information table
            const insertExtraInfoSQL = `
              INSERT INTO extra_information (employee_id, alternative_phone_number, physically_challenged)
              VALUES (?, ?, ?)
            `;

            const extraInfoValues = [
              employeeId,
              alternative_phone_number,
              physically_challenged,
            ];

            connection.query(insertExtraInfoSQL, extraInfoValues, (err) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res.status(500).send({ message: "Internal Error" });
                });
                return;
              }

              // Iterate through skills and insert each one
              if (Array.isArray(skills) && skills.length > 0) {
                const insertSkillsSQL = `
                  INSERT INTO employee_skills (employee_id, skill_id)
                  VALUES (?, ?)
                `;

                skills.forEach((skillName) => {
                  // Check if the skill already exists
                  const checkSkillSQL = `
                    SELECT skill_id FROM skills WHERE skill_name = ?
                  `;

                  connection.query(checkSkillSQL, [skillName], (err, skillResult) => {
                    if (err) {
                      console.error(err);
                      connection.rollback(() => {
                        res.status(500).send({ message: "Internal Error" });
                      });
                      return;
                    }

                    if (skillResult.length > 0) {
                      // Skill exists, use its skill_id
                      const skillId = skillResult[0].skill_id;
                      const skillValues = [employeeId, skillId];

                      // Insert into the employee_skills table
                      connection.query(insertSkillsSQL, skillValues, (err) => {
                        if (err) {
                          console.error(err);
                          connection.rollback(() => {
                            res.status(500).send({ message: "Internal Error" });
                          });
                          return;
                        }
                      });
                    } else {
                      // Skill doesn't exist, insert it into the skills table
                      const insertNewSkillSQL = `
                        INSERT INTO skills (skill_name)
                        VALUES (?)
                      `;

                      connection.query(insertNewSkillSQL, [skillName], (err, newSkillResult) => {
                        if (err) {
                          console.error(err);
                          connection.rollback(() => {
                            res.status(500).send({ message: "Internal Error" });
                          });
                          return;
                        }

                        const skillId = newSkillResult.insertId;
                        const skillValues = [employeeId, skillId];

                        // Insert into the employee_skills table
                        connection.query(insertSkillsSQL, skillValues, (err) => {
                          if (err) {
                            console.error(err);
                            connection.rollback(() => {
                              res.status(500).send({ message: "Internal Error" });
                            });
                            return;
                          }
                        });
                      });
                    }
                  });
                });
              }

              // Insert into the experience table
              const insertExperienceSQL = `
                INSERT INTO experience (employee_id, experience_description)
                VALUES (?, ?)
              `;

              const experienceValues = [employeeId, experience_description];

              connection.query(insertExperienceSQL, experienceValues, (err) => {
                if (err) {
                  console.error(err);
                  connection.rollback(() => {
                    res.status(500).send({ message: "Internal Error" });
                  });
                  return;
                }

                // Insert into the projects table
                const insertProjectsSQL = `
                  INSERT INTO projects (employee_id, portfolio_url, github_url)
                  VALUES (?, ?, ?)
                `;

                const projectsValues = [employeeId, portfolio_url, github_url];

                connection.query(insertProjectsSQL, projectsValues, (err) => {
                  if (err) {
                    console.error(err);
                    connection.rollback(() => {
                      res.status(500).send({ message: "Internal Error" });
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

                    // Transaction was successful, send a response to the client
                    res.status(200).send({
                      message: `Employee ${name} created successfully`,
                      employee_id: employeeId,
                    });
                  });
                });
              });
            });
          }
        );
      });
    });
  });
};
