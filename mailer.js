// mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendSelectionEmail = async (to, projectTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "You've been selected for a project!",
      text: `Congratulations! You've been selected for the project: ${projectTitle}. Please start working.`,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};

module.exports = { sendSelectionEmail };
