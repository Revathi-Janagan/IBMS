const connection = require("../../Helper/db");
const util = require("util");

const query = util.promisify(connection.query).bind(connection);

module.exports = async (req, res) => {
  try {
    const getAllEmployeesSQL = `
    SELECT
    e.employee_id,
    e.name,
    e.education,
    e.experience,
    e.designation,
    e.profile_pic,
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
    p.github_url,
    a.password,
    GROUP_CONCAT(es.skill_name) AS skills
FROM employees e
LEFT JOIN personal_information pi ON e.employee_id = pi.employee_id
LEFT JOIN contact_details cd ON e.employee_id = cd.employee_id
LEFT JOIN extra_information ei ON e.employee_id = ei.employee_id
LEFT JOIN experience ex ON e.employee_id = ex.employee_id
LEFT JOIN projects p ON e.employee_id = p.employee_id
LEFT JOIN admin a ON e.employee_id = a.employee_id
LEFT JOIN employee_skills es ON e.employee_id = es.employee_id
GROUP BY
    e.employee_id,
    e.name,
    e.education,
    e.experience,
    e.designation,
    e.profile_pic,
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
    p.github_url,
    a.password;


    `;

    const results = await query(getAllEmployeesSQL);

    // Process the results to split the skills into an array
    const employeesWithSkills = results.map((employee) => {
      if (employee.skills) {
        employee.skills = employee.skills
          .split(",")
          .map((skill) => skill.trim());
      }
      return employee;
    });

    res.status(200).json({ employees: employeesWithSkills });
    console.log("Listed Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Error" });
  }
};
