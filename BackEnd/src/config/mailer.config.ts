import nodemailer from "nodemailer";

export const mailTransporter = nodemailer.createTransport({
  host: "mailpit",
  port: 1025,
  // secure: false,
  // auth: {
  //   user: process.env.GMAIL_USER,
  //   pass: process.env.GMAIL_PASS,
  // },
  // tls: {
  //   rejectUnauthorized: false,
  // }
});
