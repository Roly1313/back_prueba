const nodemailer = require("nodemailer");
const config = require("./auth.config");
require('dotenv').config()

const user = process.env.USER_MAIL;
const pass = process.env.PASS_MAIL;
const url_back = process.env.URL_BACK;
const port= process.env.PORT;
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, lastname, email, confirmationCode) => {
    console.log("Check");
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${lastname} ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=${url_back}/auth/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };