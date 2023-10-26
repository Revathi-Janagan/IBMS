const connection = require("../../Helper/db");

module.exports= (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM employees', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const employeeCount = results[0].count;
      res.json({ count: employeeCount });
    });
  };

  
  