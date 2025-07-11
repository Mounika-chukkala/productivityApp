const nodemailer=require("nodemailer")
const dotenv=require("dotenv");
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require("../config/dotenv.config");
dotenv.config();
const transporter=nodemailer.createTransport({
      host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
  
    pass: EMAIL_PASS,
  },

})

module.exports=transporter