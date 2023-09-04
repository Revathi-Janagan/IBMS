const nodemailer = require("nodemailer");

const { GMAIL_USERNAME, GMAIL_PASSWORD } = require("../Config/config");
module.exports = {
  sendRegisterEmail: async (email) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USERNAME,
          pass: GMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: "srevathisona@gmail.com",
        to: email,
        subject: "Welcome, you are a member of IBMS now ....",
        html: `you have successfully registered with us
                ${
                  email?.split("@")[0]
                }, Login and enjoy the services of IBMS...,`,
      };

      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error while sending Email:", error);
    }
  },
};
