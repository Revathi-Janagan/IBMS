const connection = require("../../Helper/db");

module.exports = (req, res) => {
  const employeeId = req.params.id;
  const getEmployeeSQL = `
    SELECT e.employee_id, 
           e.name, 
           e.profile_pic,
           e.experience,
           e.designation,
           e.isAdmin,
           pi.dob, 
           pi.marital_status, 
           pi.gender, 
           pi.place, 
           cd.mobile_number, 
           cd.email, 
           ei.alternative_phone_number, 
           ei.physically_challenged, 
           GROUP_CONCAT(s.skill_name) AS skills,
           ex.experience_description, 
           p.portfolio_url, 
           p.github_url
    FROM employees e
    LEFT JOIN personal_information pi ON e.employee_id = pi.employee_id
    LEFT JOIN contact_details cd ON e.employee_id = cd.employee_id
    LEFT JOIN extra_information ei ON e.employee_id = ei.employee_id
    LEFT JOIN employee_skills es ON e.employee_id = es.employee_id
    LEFT JOIN skills s ON es.skill_id = s.skill_id
    LEFT JOIN experience ex ON e.employee_id = ex.employee_id
    LEFT JOIN projects p ON e.employee_id = p.employee_id
    WHERE e.employee_id = ?
    GROUP BY e.employee_id, 
             e.name, 
             e.profile_pic,
             e.experience,
             e.designation,
             e.isAdmin,
             pi.dob, 
             pi.marital_status, 
             pi.gender, 
             pi.place, 
             cd.mobile_number, 
             cd.email, 
             ei.alternative_phone_number, 
             ei.physically_challenged, 
             ex.experience_description, 
             p.portfolio_url, 
             p.github_url;
  `;

  connection.query(getEmployeeSQL, [employeeId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Internal Error" });
    }
    if (results.length === 0) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.status(200).json(results[0]);
  });
};
