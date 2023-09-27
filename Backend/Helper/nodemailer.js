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
  sendAdminRegisterEmail: async (email) => {
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
        subject: "Welcome, you are a Admin member of IBMS now ....",
        html: `You have successfully registered as an Admin with us
        ${email?.split("@")[0]}, 
        Login and enjoy the services of IBMS...,
        Your Password: ${password}`,
      };

      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error while sending Email:", error);
    }
  },
  sendPasswordResetEmail: async (email, resetToken) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USERNAME,
          pass: GMAIL_PASSWORD,
        },
      });
      
      // Construct the reset link with the reset token as a query parameter
      const resetLink = `https://localhost:4070/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: "srevathisona@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `
          <p>You have requested to reset your password.</p>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error while sending Email:", error);
    }
  },
};
