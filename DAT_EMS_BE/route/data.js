const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const dataProcess = require("./dataProcess.js");
const authMiddleware = (req, res, next) => {
  try {
    // ==========================================
    // 1. Get token
    // ==========================================

    let token = req.headers.token;

    // Nếu không có header "token"
    // thì kiểm tra Authorization Bearer
    if (!token) {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // ==========================================
    // 2. Token required
    // ==========================================

    if (!token) {
      return res.status(401).json({
        status: false,
        mess: "Access token is required",
      });
    }

    // ==========================================
    // 3. Verify
    // ==========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ==========================================
    // 4. Save decoded JWT
    // ==========================================

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.name);
    console.error("JWT MESSAGE:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        mess: "Token expired",
      });
    }

    return res.status(401).json({
      status: false,
      mess: "Invalid token",
    });
  }
};
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
// SEND OTP
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
    // 2. Generate OTP
    // ==========================================

    const otp = crypto.randomInt(100000, 1000000).toString();

    // ==========================================
    // 3. OTP expiration
    // ==========================================

    const expiresMinutes = Number(process.env.OTP_EXPIRES_MINUTES) || 5;

    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    // ==========================================
    // 4. Escape SQL
    // ==========================================

    const emailSafe = email.replace(/'/g, "''");
    const otpSafe = otp.replace(/'/g, "''");

    // ==========================================
    // 5. Save OTP to PostgreSQL
    //
    // func_saveotp returns BOOLEAN
    // => use funcJSON
    // ==========================================

    const result = await dataProcess.funcJSON(
      "func_saveotp",
      `('${emailSafe}', '${otpSafe}', '${expiresAt.toISOString()}')`,
    );

    // Account không tồn tại hoặc không inactive
    if (result !== true) {
      return res.status(400).json({
        status: false,
        mess: "Account not found or already active",
      });
    }

    // ==========================================
    // 6. Send email
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

          <p>Your verification code is:</p>

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
    // 7. Response
    // ==========================================

    return res.status(200).json({
      status: true,
      mess: "Verification code sent",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      status: false,
      mess: "Cannot send verification code",
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

    const emailSafe = email.replace(/'/g, "''");
    const codeSafe = code.replace(/'/g, "''");

    // ==========================================
    // 2. Check OTP
    // ==========================================

    const otpValid = await dataProcess.funcJSON(
      "func_checkotp",
      `('${emailSafe}', '${codeSafe}')`,
    );

    // ==========================================
    // 3. OTP sai hoặc hết hạn
    // ==========================================

    if (otpValid !== true) {
      return res.status(400).json({
        status: false,
        mess: "Invalid or expired verification code",
      });
    }

    // ==========================================
    // 4. OTP đúng -> active account
    // ==========================================

    const updateResult = await dataProcess.funcJSON(
      "func_updatestatus",
      `('${emailSafe}', 'active')`,
    );

    if (updateResult !== true) {
      return res.status(400).json({
        status: false,
        mess: "Cannot activate account",
      });
    }

    // ==========================================
    // 5. Success
    // ==========================================

    return res.status(200).json({
      status: true,
      mess: "Account verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      status: false,
      mess: "System error",
    });
  }
});

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

// ======================================================
// REGISTER ACCOUNT
// POST /api/register
// ======================================================

router.post("/register", async (req, res) => {
  try {
    let { username, email, password, full_name, phone, address } = req.body;

    // ==========================================
    // 1. Validate required fields
    // ==========================================

    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        mess: "Username, email and password are required",
      });
    }

    // ==========================================
    // 2. Normalize input
    // ==========================================

    username = username.trim();
    email = email.trim().toLowerCase();

    full_name = full_name?.trim() || null;
    phone = phone?.trim() || null;
    address = address?.trim() || null;

    // ==========================================
    // 3. Validate email
    // ==========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: false,
        mess: "Invalid email",
      });
    }

    // ==========================================
    // 4. Validate password
    // ==========================================

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        mess: "Password must be at least 6 characters",
      });
    }

    // ==========================================
    // 5. Hash password
    // ==========================================

    const passwordHash = await bcrypt.hash(password, 12);

    // ==========================================
    // 6. Escape data
    // Vì dataProcess hiện tại đang ghép SQL string
    // ==========================================

    const escapeSQL = (value) => {
      if (value === null || value === undefined) {
        return "NULL";
      }

      return `'${String(value).replace(/'/g, "''")}'`;
    };

    // ==========================================
    // 7. Call PostgreSQL function
    //
    // SELECT *
    // FROM func_registerAccount(
    //   'username',
    //   'email',
    //   'password hash',
    //   'full name',
    //   'phone',
    //   'address'
    // );
    // ==========================================

    const data = `(
      ${escapeSQL(username)},
      ${escapeSQL(email)},
      ${escapeSQL(passwordHash)},
      ${escapeSQL(full_name)},
      ${escapeSQL(phone)},
      ${escapeSQL(address)}
    )`;

    const result = await dataProcess.funcTable("func_registerAccount", data);

    // ==========================================
    // 8. Database error
    // ==========================================

    if (!result.status) {
      return res.status(500).json({
        status: false,
        mess: "Database error",
      });
    }

    // ==========================================
    // 9. Register failed
    // ==========================================

    if (!result.data || result.data.length === 0) {
      return res.status(500).json({
        status: false,
        mess: "Cannot create account",
      });
    }

    // ==========================================
    // 10. Account created
    // ==========================================

    const user = result.data[0];

    return res.status(201).json({
      status: true,
      mess: "Account created successfully",

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        status: user.status,
        full_name: user.full_name,
        phone: user.phone,
        address: user.address,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      status: false,
      mess: "System error",
    });
  }
});
// ======================================================
// GET USER INFO
// GET /api/user-info
// ======================================================

router.get("/user-info", authMiddleware, async (req, res) => {
  try {
    // ==========================================
    // 1. Get user id from JWT
    // ==========================================

    const userId = req.user.id;

    // ==========================================
    // 2. Get user info from PostgreSQL
    // ==========================================

    const result = await dataProcess.funcTable(
      "func_getuserinfo",
      `(${Number(userId)})`,
    );

    // ==========================================
    // 3. User not found
    // ==========================================

    if (
      !result ||
      result.status !== true ||
      !result.data ||
      result.data.length === 0
    ) {
      return res.status(404).json({
        status: false,
        mess: "User not found",
      });
    }

    // ==========================================
    // 4. User data
    // ==========================================

    const user = result.data[0];

    // ==========================================
    // 5. Response
    // ==========================================

    return res.status(200).json({
      status: true,
      mess: "Get user information successfully",

      data: {
        id: user.id,
        username: user.username,
        email: user.email,

        name: user.full_name,
        phone: user.phone,
        address: user.address,
        image: user.avatar,

        role_id: user.role_id,
        role_name: user.role_name,
        rule_id: user.rule_id,
        account_status: user.status,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);

    return res.status(500).json({
      status: false,
      mess: "System error",
    });
  }
});

module.exports = router;
