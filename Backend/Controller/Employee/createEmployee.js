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
    marital_status,
    gender,
    place,
    mobile_number,
    email,
    alternative_phone_number,
    experience_description,
    portfolio_url,
    github_url,
    password,
    isAdmin,
    dob,
    physically_challenged,
    skills,
  } = req.body;

  if (!req.files || !req.files["profile_pic"]) {
    return res.status(400).send({ message: "Please upload a profile picture" });
  }

  const profile_pic = req.files["profile_pic"][0].filename;

  // Begin a transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error", error: err });
    }

    const employeeValues = {
      name,
      profile_pic,
      experience,
      designation,
      education,
      isAdmin: isAdmin === "Yes" ? 1 : 0,
    };

    connection.query("INSERT INTO employees SET ?", employeeValues, (err, result) => {
      if (err) {
        console.error(err);
        return connection.rollback(() => {
          res.status(500).send({ message: "Internal Error", error: err });
        });
      }
      const employeeId = result.insertId;

      if (isAdmin === "Yes") {
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return connection.rollback(() => {
              res.status(500).send({ message: "Internal Error", error: err });
            });
          }

          const adminValues = {
            employee_id: employeeId,
            email,
            password: hashedPassword,
          };

          connection.query("INSERT INTO admin SET ?", adminValues, (err) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error", error: err });
              });
            }
            sendAdminRegisterEmail(email, password);
          });
        });
      }

      const formattedDOB = new Date(dob).toISOString().slice(0, 10);

      const personalInfoValues = {
        employee_id: employeeId,
        dob: formattedDOB,
        marital_status,
        gender,
        place,
      };

      connection.query("INSERT INTO personal_information SET ?", personalInfoValues, (err) => {
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

        connection.query("INSERT INTO contact_details SET ?", contactDetailsValues, (err) => {
          if (err) {
            console.error(err);
            return connection.rollback(() => {
              res.status(500).send({ message: "Internal Error" });
            });
          }

          const physicallyChallengedInt = physically_challenged.toLowerCase() === "yes" ? 1 : 0;
          const extraInfoValues = {
            employee_id: employeeId,
            alternative_phone_number,
            physically_challenged: physicallyChallengedInt,
          };

          connection.query("INSERT INTO extra_information SET ?", extraInfoValues, (err) => {
            if (err) {
              console.error(err);
              return connection.rollback(() => {
                res.status(500).send({ message: "Internal Error" });
              });
            }

            let skillsArray;
            if (!Array.isArray(skills)) {
              // Handle the case where skills is not an array, e.g., by converting it to an array.
              skillsArray = [skills]; // Assuming skills is a single skill, convert it to an array.
            } else {
              skillsArray = skills; // Skills is already an array, use it as is.
            }
            
            insertSkills(employeeId, skillsArray, () => {
              insertExperienceAndProjects(employeeId, () => {
                connection.commit((err) => {
                  if (err) {
                    console.error(err);
                    res.status(500).send({ message: "Internal Error", error: err });
                  } else {
                    res.status(200).send({
                      message: `Employee ${name} created successfully`,
                      employee_id: employeeId,
                      skills: skillsArray,
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });

  function insertSkills(employeeId, skills, callback) {
    const skillInsertCount = skills.length;
    let insertedCount = 0;
    for (const skillName of skills) {
      const skillValues = {
        employee_id: employeeId,
        skill_name: skillName,
      };

      connection.query("INSERT INTO employee_skills SET ?", skillValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error" });
          });
        } else {
          insertedCount++;
          if (insertedCount === skillInsertCount) {
            callback();
          }
        }
      });
    }
  }

  function insertExperienceAndProjects(employeeId, callback) {
    const experienceValues = {
      employee_id: employeeId,
      experience_description,
    };

    connection.query("INSERT INTO experience SET ?", experienceValues, (err) => {
      if (err) {
        console.error(err);
        connection.rollback(() => {
          res.status(500).send({ message: "Internal Error" });
        });
      }

      const projectsValues = {
        employee_id: employeeId,
        portfolio_url,
        github_url,
      };

      connection.query("INSERT INTO projects SET ?", projectsValues, (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error" });
          });
        }

        callback();
      });
    });
  }
};
