const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const employeeId = req.params.id; // Assuming the employee ID is passed as a URL parameter

  // Check if the employee with the given ID exists
  const checkEmployeeExistsSQL = `
    SELECT * FROM employees
    WHERE employee_id = ?
  `;

  connection.query(checkEmployeeExistsSQL, [employeeId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error",error:err });
    }

    // Check if there are no results (employee not found)
    if (results.length === 0) {
      return res.status(404).send({ message: `Employee with ID ${employeeId} not found` });
    }

    // Employee exists, begin a transaction
    connection.beginTransaction((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Error",error:err });
      }

      // Define SQL statements to delete from related tables
      const deleteContactDetailsSQL = `
        DELETE FROM contact_details
        WHERE employee_id = ?
      `;

      const deleteExtraInfoSQL = `
        DELETE FROM extra_information
        WHERE employee_id = ?
      `;

      const deleteEmployeeSkillsSQL = `
        DELETE FROM employee_skills
        WHERE employee_id = ?
      `;

      const deleteExperienceSQL = `
        DELETE FROM experience
        WHERE employee_id = ?
      `;

      const deleteProjectsSQL = `
        DELETE FROM projects
        WHERE employee_id = ?
      `;

      // Define SQL statement to delete from employees table
      const deleteEmployeeSQL = `
        DELETE FROM employees
        WHERE employee_id = ?
      `;

      // Execute SQL delete statements in sequence
      connection.query(deleteContactDetailsSQL, [employeeId], (err) => {
        if (err) {
          console.error(err);
          connection.rollback(() => {
            res.status(500).send({ message: "Internal Error",error:err });
          });
          return;
        }

        connection.query(deleteExtraInfoSQL, [employeeId], (err) => {
          if (err) {
            console.error(err);
            connection.rollback(() => {
              res.status(500).send({ message: "Internal Error",error:err });
            });
            return;
          }

          connection.query(deleteEmployeeSkillsSQL, [employeeId], (err) => {
            if (err) {
              console.error(err);
              connection.rollback(() => {
                res.status(500).send({ message: "Internal Error",error:err });
              });
              return;
            }

            connection.query(deleteExperienceSQL, [employeeId], (err) => {
              if (err) {
                console.error(err);
                connection.rollback(() => {
                  res.status(500).send({ message: "Internal Error",error:err });
                });
                return;
              }

              connection.query(deleteProjectsSQL, [employeeId], (err) => {
                if (err) {
                  console.error(err);
                  connection.rollback(() => {
                    res.status(500).send({ message: "Internal Error" ,error:err});
                  });
                  return;
                }

                // Finally, delete the employee from the employees table
                connection.query(deleteEmployeeSQL, [employeeId], (err) => {
                  if (err) {
                    console.error(err);
                    connection.rollback(() => {
                      res.status(500).send({ message: "Internal Error",error:err });
                    });
                    return;
                  }

                  // Commit the transaction
                  connection.commit((err) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send({ message: "Internal Error",error:err });
                      return;
                    }

                    // Transaction was successful, send a response to the client
                    res.status(200).send({
                      message: `Employee with ID ${employeeId} deleted successfully`,
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};
