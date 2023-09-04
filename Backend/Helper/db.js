const mysql = require("mysql2");
require("dotenv").config();
const {
  MYSQL_HOST,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = require("../Config/config");

const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.log("Error while Connecting DB", err);
  } else {
    console.log("DB Connected Successfully!!!");
  }
});

module.exports = connection;
