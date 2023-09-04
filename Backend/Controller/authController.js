const connection = require("../Helper/db");
const { sendRegisterEmail } = require("../Helper/nodemailer");
module.exports = {
  registerSuperAdmin: (req, res) => {
    console.log("Inside Super Admin Registration");
    const {name , email, password , phone_number, profile_pic} = req.body;
    if(!name || !email || !password || !phone_number ||!profile_pic){
        return res.status(400).send({ message: "Please Fill All the Fields" });

    }
    const selectSql = "SELECT * FROM super_admin WHERE email = ?";
    connection.query(selectSql,[email],(err,result)=>{
      if(err){
        console.error(err);
        return res
          .status(500)
          .send({ message: "Some Internal Error Occurred" });
      }else if (result.length > 0) {
        return res
          .status(409)
          .send({ message: "User with this Email Id Already Exists..." });
      }
      const insertSQL = "INSERT INTO super_admin()"
    })
  },
  loginUser: (req, res) => {},
};
