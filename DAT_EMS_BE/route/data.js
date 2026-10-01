const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const dataProcess = require("./dataProcess.js");

router.post("/login", async (req, res) => {
  try {
    const { account, password } = req.body;
    if (!account || !password) {
      return res.status(400).json({
        status: false,
        mess: "Account and password are required",
      });
    }
    const accountSafe = account.trim().replace(/'/g, "''");
    const result = await dataProcess.funcTable(
      "func_loginuser",
      `('${accountSafe}')`,
    );

    if (!result.status) {
      return res.status(500).json({
        status: false,
        mess: "Database error",
      });
    }

    if (!result.data || result.data.length === 0) {
      return res.status(401).json({
        status: false,
        mess: "Invalid account or password",
      });
    }

    const user = result.data[0];

    const passwordMatch = await bcrypt.compare(password, user.password_);

    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        mess: "Invalid account or password",
      });
    }

    if (user.status_ !== "active") {
      return res.status(403).json({
        status: false,
        mess: "Account is not active",
      });
    }

    const token = jwt.sign(
      {
        id: user.id_,
        username: user.username_,
        role_id: user.role_id_,
        role: user.role_name_,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    return res.status(200).json({
      status: true,
      mess: "Login successful",

      token: token,

      user: {
        id: user.id_,
        username: user.username_,
        email: user.email_,

        full_name: user.full_name_,
        phone: user.phone_,
        address: user.address_,
        avatar: user.avatar_,

        role_id: user.role_id_,
        role_name: user.role_name_,

        rule_id: user.rule_id_,
        permission: user.permission_,

        status: user.status_,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      status: false,
      mess: "System error",
    });
  }
});

// ======================================================
// MAIL CONFIG
// ======================================================

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// ======================================================
// TEMP OTP STORAGE
//
// Development only.
// Production nên dùng Redis hoặc DB.
// ======================================================

const otpStore = new Map();

// ======================================================
// SEND VERIFICATION CODE
// POST /api/send-code
// ======================================================

router.post("/send-code", async (req, res) => {
  try {
    let { email } = req.body;

    // ==========================================
    // 1. Validate
    // ==========================================

    if (!email) {
      return res.status(400).json({
        status: false,
        mess: "Email is required",
      });
    }

    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        mess: "Invalid email",
      });
    }

    // ==========================================
    // 2. Generate 6 digit OTP
    // ==========================================

    const otp = crypto.randomInt(100000, 1000000).toString();

    // ==========================================
    // 3. Expiration
    // ==========================================

    const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES) || 5;

    const expiresAt = Date.now() + expiresMinutes * 60 * 1000;

    // ==========================================
    // 4. Send email FIRST
    // ==========================================

    await transporter.sendMail({
      from: `"EMS System" <${process.env.MAIL_FROM}>`,

      to: email,

      subject: "EMS - Email Verification",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
        ">

          <h2>EMS Email Verification</h2>

          <p>
            Your verification code is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 25px 0;
          ">
            ${otp}
          </div>

          <p>
            This code will expire in
            ${expiresMinutes} minutes.
          </p>

          <p>
            If you did not request this code,
            you can ignore this email.
          </p>

        </div>
      `,
    });

    // ==========================================
    // 5. Save OTP after mail succeeds
    // ==========================================

    otpStore.set(email, {
      otp,
      expiresAt,
      verified: false,
    });

    // ==========================================
    // 6. Response
    // ==========================================

    return res.status(200).json({
      status: true,
      mess: "Verification code sent",
    });
  } catch (error) {
    console.error("Send code error:", error);

    return res.status(500).json({
      status: false,
      mess: "Cannot send verification email",
    });
  }
});
// ======================================================
// VERIFY CODE
// POST /api/verify-code
// ======================================================

router.post("/verify-code", async (req, res) => {
  try {
    let { email, code } = req.body;

    // ==========================================
    // 1. Validate
    // ==========================================

    if (!email || !code) {
      return res.status(400).json({
        status: false,
        mess: "Email and verification code are required",
      });
    }

    email = email.trim().toLowerCase();
    code = String(code).trim();

    // ==========================================
    // 2. Get OTP
    // ==========================================

    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({
        status: false,
        mess: "Verification code not found",
      });
    }

    // ==========================================
    // 3. Check expiration
    // ==========================================

    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        status: false,
        mess: "Verification code expired",
      });
    }

    // ==========================================
    // 4. Compare
    // ==========================================

    if (otpData.otp !== code) {
      return res.status(400).json({
        status: false,
        mess: "Invalid verification code",
      });
    }

    // ==========================================
    // 5. Mark verified
    // ==========================================

    otpData.verified = true;

    otpStore.set(email, otpData);

    return res.status(200).json({
      status: true,
      mess: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify code error:", error);

    return res.status(500).json({
      status: false,
      mess: "System error",
    });
  }
});

// ======================================================
// TEST SEND MAIL
// POST /api/test-mail
// ======================================================

router.post("/test-mail", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate
    if (!email) {
      return res.status(400).json({
        status: false,
        mess: "Email is required",
      });
    }

    // Tạo OTP test 6 số
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Gửi mail
    const info = await transporter.sendMail({
      from: `"EMS System" <${process.env.MAIL_FROM}>`,
      to: email,
      subject: "EMS - Test Mail",

      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>EMS Test Email</h2>

          <p>Your test OTP is:</p>

          <h1 style="letter-spacing: 6px;">
            ${otp}
          </h1>

          <p>
            This email is used to test the EMS mail service.
          </p>
        </div>
      `,
    });

    console.log("Test mail sent:");
    console.log("To:", email);
    console.log("OTP:", otp);
    console.log("Message ID:", info.messageId);

    return res.status(200).json({
      status: true,
      mess: "Test mail sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Test mail error:", error);

    return res.status(500).json({
      status: false,
      mess: "Failed to send test mail",
      error: error.message,
    });
  }
});

module.exports = router;
