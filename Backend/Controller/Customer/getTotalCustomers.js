const connection = require("../../Helper/db");

module.exports= (req, res) => {
    connection.query('SELECT COUNT(*) AS count FROM customers', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      const customerCount = results[0].count;
      res.json({ count: customerCount });
    });
  };

  
  