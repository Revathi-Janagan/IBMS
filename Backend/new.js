const connection = require("../helper/db");
const { sendRegisterEmail } = require("../helper/nodemailer");
const bcrypt = require("bcrypt");
const { ACCESS_TOKEN } = require("../config/config");
const jwt = require("jsonwebtoken"); 
const saltRounds = 10;

module.exports = {
  registerUser: (req, res) => {
    console.log("Inside Register User!");

    const { userName, email, password, dob, isEmployer, about, userImage } =
      req.body;

    if (
      !userName ||
      !email ||
      !password ||
      !dob ||
      typeof isEmployer !== "boolean"
    ) {
      return res.status(400).send({ message: "Please Fill All the Fields" });
    }

    const selectSQL = "SELECT * FROM users WHERE email = ?";
    connection.query(selectSQL, [email], (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send({ message: "Some Internal Error Occurred" });
      } else if (result.length > 0) {
        return res
          .status(409)
          .send({ message: "User with this Email Id Already Exists..." });
      }
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const insertSQL =
        "INSERT INTO users(userName, email, password, dob, isEmployer, about, userImage) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [
        userName,
        email,
        hashedPassword,
        dob,
        isEmployer,
        about,
        userImage,
      ];
      connection.query(insertSQL, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Internal Error" });
        } else if (result.affectedRows === 0) {
          return res.status(500).send({ message: "No Table Found" });
        } else {
          sendRegisterEmail(email);
          console.log(email);
          res.status(200).send({
            message: `Thank You ${
              userName.split("")[0]
            } for registering with us`,
          });
        }
      });
    });
  },

  loginUser: (req, res) => {
    console.log("Inside Login User....");
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    connection.query(sql, [email], (err, result) => {
      if (err) {
        return res.status(400).send({ message: "Internal Error" });
      }
      const user = result[0];
      if (!user) {
        return res.status(400).send({ message: "User not Found" });
      }
      bcrypt.compare(password, user.password, async function (err, result) {
        if (err) {
          return res
            .status(400)
            .send({ message: "Error while creating hashing Password" });
        } else if (!result) {
          return res.status(400).send({ message: "Password Not Match" });
        }
        const payload = {
          userId: user.userId,
          isEmployer: user.isEmployer
      };
      console.log(payload)
        const token = jwt.sign( payload , ACCESS_TOKEN, {
          expiresIn: "12h",
        });
        res.status(200).json({
          message: "Login Success",
          user: user,
          token: token,
        });
        // res .status(200).send ({message:"Login Successfull", user:userId});
      });
    });
  },
};
