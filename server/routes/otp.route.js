const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();

const otpStore = new Map(); // Replace with DB or Redis for production

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required." });

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore.set(email, { otp, expiresAt });

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ChatNest OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your ChatNest OTP",
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("OTP Email Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ success: false, message: "No OTP found." });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: "OTP expired." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  otpStore.delete(email);
  res.json({ success: true, message: "OTP verified." });
});

module.exports = router;

