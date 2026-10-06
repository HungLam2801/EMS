import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LuEye,
  LuEyeOff,
  LuGlobe,
  LuLock,
  LuUser,
  LuMail,
} from "react-icons/lu";

import { RiArrowGoBackLine } from "react-icons/ri";

import { useLanguage } from "../../Lang/LanguageProvider";
import { useIntl } from "react-intl";

import "./Login.scss";

import { callApi } from "../../API/Api";
import { isMobile } from "react-device-detect";

// ============================================================
// CONSTANT
// ============================================================

const EMPTY_REGISTER = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  full_name: "",
  phone: "",
  address: "",
};

const EMPTY_OTP = ["", "", "", "", "", ""];

export default function Login() {
  const lang = useIntl();

  const { locale, setLocale } = useLanguage();

  const navigate = useNavigate();

  // ============================================================
  // BACKGROUND
  // ============================================================

  const backgroundStyle = {
    backgroundImage:
      "linear-gradient(rgba(7, 15, 32, 0.28), rgba(7, 15, 32, 0.42)), url(https://embody.com.vn/BG/728_0/1/tontaynam.jpg)",
  };

  // ============================================================
  // AUTH MODE
  // ============================================================

  /*
    login
    register
    registerOtp
  */

  const [authMode, setAuthMode] = useState("login");

  // ============================================================
  // LOGIN STATE
  // ============================================================

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // ============================================================
  // REGISTER STATE
  // ============================================================

  const [registerData, setRegisterData] = useState({
    ...EMPTY_REGISTER,
  });

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState(false);

  // ============================================================
  // OTP STATE
  // ============================================================

  const [registerEmail, setRegisterEmail] = useState("");

  const [registerOtp, setRegisterOtp] = useState([...EMPTY_OTP]);

  const otpRefs = useRef([]);

  const [countdown, setCountdown] = useState(60);

  // ============================================================
  // COMMON STATE
  // ============================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ============================================================
  // LANGUAGE
  // ============================================================

  const handleChangeLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };

  const text = (vi, en) => {
    return locale === "vi" ? vi : en;
  };

  // ============================================================
  // CLEAR MESSAGE
  // ============================================================

  const clearMessage = () => {
    setError("");
    setSuccess("");
  };

  // ============================================================
  // OTP COUNTDOWN
  // ============================================================

  useEffect(() => {
    if (authMode !== "registerOtp") {
      return;
    }

    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [authMode, countdown]);

  // ============================================================
  // LOGIN
  // ============================================================

  const login = async (account, userPassword, save) => {
    const res = await callApi(
      "post",

      `${process.env.REACT_APP_API}/login`,

      {
        account: account.trim(),

        password: userPassword,
      },
    );

    console.log("LOGIN RESPONSE:", res);

    if (res?.status !== true) {
      return false;
    }

    // Xóa session cũ
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Remember = true => localStorage
    // Remember = false => sessionStorage
    const storage = save ? localStorage : sessionStorage;

    if (res.token) {
      storage.setItem("token", JSON.stringify(res.token));
    }

    if (res.user) {
      storage.setItem("user", JSON.stringify(res.user));
    }

    navigate("/projectmanagement");

    return true;
  };

  // ============================================================
  // LOGIN SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearMessage();

    // ========================================
    // Validate account
    // ========================================

    if (!identifier.trim()) {
      setError(
        lang.formatMessage({
          id: "alarm_username",
        }),
      );

      return;
    }

    // ========================================
    // Validate password
    // ========================================

    if (!password) {
      setError(
        lang.formatMessage({
          id: "alarm_password",
        }),
      );

      return;
    }

    try {
      setLoading(true);

      const isLoggedIn = await login(identifier, password, remember);

      if (!isLoggedIn) {
        setError(
          lang.formatMessage({
            id: "login_error",
          }),
        );
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err);

      const serverMessage = err.response?.data?.mess;

      // Backend trả khi account chưa active
      if (serverMessage === "Account is not active") {
        setError(
          text(
            "Tài khoản chưa được xác thực. Vui lòng xác thực email trước.",
            "Account has not been verified. Please verify your email first.",
          ),
        );

        return;
      }

      setError(
        serverMessage ||
          lang.formatMessage({
            id: "login_error",
          }),
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OPEN REGISTER
  // ============================================================

  const handleOpenRegister = () => {
    clearMessage();

    setAuthMode("register");
  };

  // ============================================================
  // BACK LOGIN
  // ============================================================

  const handleBackLogin = () => {
    clearMessage();

    setAuthMode("login");

    setRegisterOtp([...EMPTY_OTP]);

    setCountdown(60);
  };

  // ============================================================
  // REGISTER INPUT CHANGE
  // ============================================================

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ============================================================
  // REGISTER VALIDATE
  // ============================================================

  const validateRegister = () => {
    // Username
    if (!registerData.username.trim()) {
      return text("Vui lòng nhập tên tài khoản", "Please enter username");
    }

    // Email
    if (!registerData.email.trim()) {
      return text("Vui lòng nhập email", "Please enter email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(registerData.email.trim())) {
      return text("Email không hợp lệ", "Invalid email address");
    }

    // Password
    if (!registerData.password) {
      return text("Vui lòng nhập mật khẩu", "Please enter password");
    }

    if (registerData.password.length < 6) {
      return text(
        "Mật khẩu phải có ít nhất 6 ký tự",
        "Password must contain at least 6 characters",
      );
    }

    // Confirm password
    if (!registerData.confirmPassword) {
      return text("Vui lòng nhập lại mật khẩu", "Please confirm password");
    }

    if (registerData.password !== registerData.confirmPassword) {
      return text("Mật khẩu nhập lại không khớp", "Passwords do not match");
    }

    return "";
  };

  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async (event) => {
    event.preventDefault();

    clearMessage();

    // ========================================
    // Validate
    // ========================================

    const validation = validateRegister();

    if (validation) {
      setError(validation);

      return;
    }

    const normalizedEmail = registerData.email.trim().toLowerCase();

    try {
      setLoading(true);

      // ========================================
      // 1. REGISTER ACCOUNT
      // ========================================

      const registerRes = await callApi(
        "post",

        `${process.env.REACT_APP_API}/register`,

        {
          username: registerData.username.trim(),

          email: normalizedEmail,

          password: registerData.password,

          full_name: registerData.full_name.trim(),

          phone: registerData.phone.trim(),

          address: registerData.address.trim(),
        },
      );

      console.log("REGISTER RESPONSE:", registerRes);

      if (registerRes?.status !== true) {
        setError(
          registerRes?.mess || text("Đăng ký thất bại", "Registration failed"),
        );

        return;
      }

      // ========================================
      // 2. SEND OTP
      // ========================================

      const otpRes = await callApi(
        "post",

        `${process.env.REACT_APP_API}/send-code`,

        {
          email: normalizedEmail,
        },
      );

      console.log("SEND OTP RESPONSE:", otpRes);

      if (otpRes?.status !== true) {
        setError(
          otpRes?.mess ||
            text(
              "Tạo tài khoản thành công nhưng không gửi được OTP",
              "Account created but OTP could not be sent",
            ),
        );

        return;
      }

      // ========================================
      // 3. OPEN OTP SCREEN
      // ========================================

      setRegisterEmail(normalizedEmail);

      setRegisterOtp([...EMPTY_OTP]);

      setCountdown(60);

      setAuthMode("registerOtp");

      setSuccess(
        text(
          `Mã OTP đã được gửi đến ${normalizedEmail}`,
          `OTP has been sent to ${normalizedEmail}`,
        ),
      );

      // Focus ô OTP đầu tiên
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err);

      setError(
        err.response?.data?.mess ||
          text("Không thể đăng ký tài khoản", "Cannot register account"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // OTP INPUT CHANGE
  // ============================================================

  const handleOtpChange = (index, value) => {
    // Chỉ cho nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...registerOtp];

    // Chỉ lấy 1 số cuối
    newOtp[index] = value.slice(-1);

    setRegisterOtp(newOtp);

    // Nhảy sang ô tiếp theo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // ============================================================
  // OTP BACKSPACE
  // ============================================================

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !registerOtp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ============================================================
  // OTP PASTE
  // ============================================================

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const value = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!value) {
      return;
    }

    const newOtp = [...EMPTY_OTP];

    value.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setRegisterOtp(newOtp);

    const nextIndex = Math.min(value.length, 5);

    otpRefs.current[nextIndex]?.focus();
  };

  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    clearMessage();

    // ========================================
    // Validate OTP
    // ========================================

    if (registerOtp.some((item) => item === "")) {
      setError(
        text("Vui lòng nhập đầy đủ mã OTP", "Please enter the complete OTP"),
      );

      return;
    }

    const code = registerOtp.join("");

    try {
      setLoading(true);

      // ========================================
      // VERIFY OTP API
      // ========================================

      const res = await callApi(
        "post",

        `${process.env.REACT_APP_API}/verify-code`,

        {
          email: registerEmail,

          code,
        },
      );

      console.log("VERIFY OTP RESPONSE:", res);

      if (res?.status !== true) {
        setError(
          res?.mess ||
            text("OTP không hợp lệ hoặc đã hết hạn", "Invalid or expired OTP"),
        );

        return;
      }

      // ========================================
      // VERIFY SUCCESS
      // ========================================

      const username = registerData.username;

      // Reset register state
      setRegisterData({
        ...EMPTY_REGISTER,
      });

      setRegisterOtp([...EMPTY_OTP]);

      setRegisterEmail("");

      setCountdown(60);

      // Quay về login
      setAuthMode("login");

      // Điền sẵn username
      setIdentifier(username);

      setPassword("");

      setSuccess(
        text(
          "Xác thực tài khoản thành công. Bạn có thể đăng nhập.",
          "Account verified successfully. You can now login.",
        ),
      );
    } catch (err) {
      console.error("VERIFY OTP ERROR:", err.response?.data || err);

      setError(
        err.response?.data?.mess ||
          text("OTP không hợp lệ hoặc đã hết hạn", "Invalid or expired OTP"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESEND OTP
  // ============================================================

  const handleResendOtp = async () => {
    // Chưa hết countdown
    if (countdown > 0) {
      return;
    }

    if (!registerEmail) {
      return;
    }

    clearMessage();

    try {
      setLoading(true);

      const res = await callApi(
        "post",

        `${process.env.REACT_APP_API}/send-code`,

        {
          email: registerEmail,
        },
      );

      console.log("RESEND OTP RESPONSE:", res);

      if (res?.status !== true) {
        setError(
          res?.mess || text("Không thể gửi lại OTP", "Cannot resend OTP"),
        );

        return;
      }

      // Reset OTP
      setRegisterOtp([...EMPTY_OTP]);

      setCountdown(60);

      setSuccess(text("OTP mới đã được gửi", "A new OTP has been sent"));

      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error("RESEND OTP ERROR:", err.response?.data || err);

      setError(
        err.response?.data?.mess ||
          text("Không thể gửi lại OTP", "Cannot resend OTP"),
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER MESSAGE
  // ============================================================

  const renderMessage = (mobile) => {
    const className = mobile
      ? "DAT_LoginMobile_Card_Form_Error"
      : "DAT_Login_Card_Form_Error";

    return (
      <>
        {error && <div className={className}>{error}</div>}

        {success && (
          <div
            className={className}
            style={{
              color: "#55efc4",
            }}
          >
            {success}
          </div>
        )}
      </>
    );
  };

  // ============================================================
  // LOGIN FORM
  // ============================================================

  const renderLogin = (mobile) => {
    const prefix = mobile ? "DAT_LoginMobile_Card" : "DAT_Login_Card";

    return (
      <div className={`${prefix}_Inner`}>
        {/* HEADER */}

        <div className={`${prefix}_Header`}>
          {mobile ? (
            <div>
              {lang.formatMessage({
                id: "login_system",
              })}
            </div>
          ) : (
            <h1>
              {lang.formatMessage({
                id: "login_system",
              })}
            </h1>
          )}

          <button
            type="button"
            className={`${prefix}_Header_Language`}
            onClick={handleChangeLanguage}
          >
            <LuGlobe />

            <span>{locale === "vi" ? "VI" : "EN"}</span>
          </button>
        </div>

        {/* FORM */}

        <form
          className={`${prefix}_Form`}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* USERNAME / EMAIL */}

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuUser />
            </span>

            <input
              type="text"
              name="ems_login_identifier"
              placeholder={lang.formatMessage({
                id: "username",
              })}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>

          {/* PASSWORD */}

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuLock />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              name="ems_login_password"
              placeholder={lang.formatMessage({
                id: "password",
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className={`${prefix}_Form_Field_Action`}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="show password"
            >
              {showPassword ? <LuEyeOff /> : <LuEye />}
            </button>
          </div>

          {/* REMEMBER */}

          <label className={`${prefix}_Form_Remember`}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />

            <span>
              {lang.formatMessage({
                id: "save_login",
              })}
            </span>
          </label>

          {/* MESSAGE */}

          {renderMessage(mobile)}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className={`${prefix}_Form_Submit`}
            disabled={loading}
          >
            {loading
              ? lang.formatMessage({
                  id: "logining",
                })
              : lang.formatMessage({
                  id: "login",
                })}
          </button>

          {/* REGISTER BUTTON */}

          {mobile ? (
            <div className={`${prefix}_Form_button`}>
              <button
                type="button"
                className={`${prefix}_Form_button_Demo`}
                onClick={handleOpenRegister}
                disabled={loading}
              >
                {text("Đăng ký tài khoản", "Create account")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`${prefix}_Form_Demo`}
              onClick={handleOpenRegister}
              disabled={loading}
            >
              {text("Đăng ký tài khoản", "Create account")}
            </button>
          )}
        </form>
      </div>
    );
  };

  // ============================================================
  // REGISTER FORM
  // ============================================================

  const renderRegister = (mobile) => {
    const prefix = mobile ? "DAT_ForgotMobile_Card" : "DAT_Forgot_Card";

    const loginPrefix = mobile ? "DAT_LoginMobile_Card" : "DAT_Login_Card";

    return (
      <div className={`${prefix}_Inner`}>
        {/* HEADER */}

        <div className={`${prefix}_Header`}>
          <div className={`${prefix}_Header_Back`} onClick={handleBackLogin}>
            <RiArrowGoBackLine />
          </div>

          {mobile ? (
            <div className={`${prefix}_Header_Title`}>
              {text("Đăng ký", "Register")}
            </div>
          ) : (
            <h1
              style={{
                textTransform: "uppercase",
              }}
            >
              {text("Đăng ký", "Register")}
            </h1>
          )}
        </div>

        {/* REGISTER FORM */}

        <form className={`${prefix}_Form`} onSubmit={handleRegister}>
          {/* USERNAME */}

          <div className={`${prefix}_Form_Label`}>
            {text("Tên tài khoản", "Username")}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuUser />
            </span>

            <input
              type="text"
              name="username"
              placeholder={text("Tên tài khoản", "Username")}
              value={registerData.username}
              onChange={handleRegisterChange}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* EMAIL */}

          <div className={`${prefix}_Form_Label`}>Email</div>

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuMail />
            </span>

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={registerData.email}
              onChange={handleRegisterChange}
              autoComplete="email"
            />
          </div>

          {/* FULL NAME */}

          <div className={`${prefix}_Form_Label`}>
            {text("Họ và tên", "Full name")}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuUser />
            </span>

            <input
              type="text"
              name="full_name"
              placeholder={text("Họ và tên", "Full name")}
              value={registerData.full_name}
              onChange={handleRegisterChange}
              autoComplete="name"
            />
          </div>

          {/* PHONE */}

          <div className={`${prefix}_Form_Label`}>
            {text("Số điện thoại", "Phone")}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <input
              type="text"
              name="phone"
              placeholder={text("Số điện thoại", "Phone")}
              value={registerData.phone}
              onChange={handleRegisterChange}
              autoComplete="tel"
            />
          </div>

          {/* ADDRESS */}

          <div className={`${prefix}_Form_Label`}>
            {text("Địa chỉ", "Address")}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <input
              type="text"
              name="address"
              placeholder={text("Địa chỉ", "Address")}
              value={registerData.address}
              onChange={handleRegisterChange}
              autoComplete="street-address"
            />
          </div>

          {/* PASSWORD */}

          <div className={`${prefix}_Form_Label`}>
            {lang.formatMessage({
              id: "password",
            })}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuLock />
            </span>

            <input
              type={showRegisterPassword ? "text" : "password"}
              name="password"
              placeholder={text("Mật khẩu", "Password")}
              value={registerData.password}
              onChange={handleRegisterChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={`${loginPrefix}_Form_Field_Action`}
              onClick={() => setShowRegisterPassword((prev) => !prev)}
              aria-label="show register password"
            >
              {showRegisterPassword ? <LuEyeOff /> : <LuEye />}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}

          <div className={`${prefix}_Form_Label`}>
            {text("Nhập lại mật khẩu", "Confirm password")}
          </div>

          <div className={`${prefix}_Form_Field`}>
            <span className={`${prefix}_Form_Field_Icon`}>
              <LuLock />
            </span>

            <input
              type={showRegisterConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder={text("Nhập lại mật khẩu", "Confirm password")}
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={`${loginPrefix}_Form_Field_Action`}
              onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
              aria-label="show confirm password"
            >
              {showRegisterConfirmPassword ? <LuEyeOff /> : <LuEye />}
            </button>
          </div>

          {/* MESSAGE */}

          {renderMessage(mobile)}

          {/* REGISTER */}

          <button
            type="submit"
            className={`${prefix}_Form_Submit`}
            disabled={loading}
          >
            {loading
              ? text("Đang đăng ký...", "Registering...")
              : text("Đăng ký", "Register")}
          </button>

          {/* BACK LOGIN */}

          <button
            type="button"
            className={`${prefix}_Form_Submit`}
            style={{
              marginTop: "10px",

              color: "var(--gray-900)",

              backgroundColor: "var(--gray-300)",
            }}
            onClick={handleBackLogin}
            disabled={loading}
          >
            {text("Quay lại đăng nhập", "Back to login")}
          </button>
        </form>
      </div>
    );
  };

  // ============================================================
  // REGISTER OTP FORM
  // ============================================================

  const renderRegisterOtp = (mobile) => {
    const prefix = mobile ? "DAT_ForgotMobile_Card" : "DAT_Forgot_Card";

    return (
      <div className={`${prefix}_Inner`}>
        {/* HEADER */}

        <div className={`${prefix}_Header`}>
          <div
            className={`${prefix}_Header_Back`}
            onClick={() => {
              clearMessage();

              setAuthMode("register");
            }}
          >
            <RiArrowGoBackLine />
          </div>

          {mobile ? (
            <div className={`${prefix}_Header_Title`}>
              {text("Xác thực tài khoản", "Verify account")}
            </div>
          ) : (
            <h1
              style={{
                textTransform: "uppercase",
              }}
            >
              {text("Xác thực tài khoản", "Verify account")}
            </h1>
          )}
        </div>

        {/* OTP FORM */}

        <form className={`${prefix}_Form`} onSubmit={handleVerifyOtp}>
          <div className={`${prefix}_Form_Sub`}>2/2</div>

          <div
            className={`${prefix}_Form_Label`}
            style={{
              color: "white",
            }}
          >
            {text("Xác thực mã OTP", "Verify OTP")}
          </div>

          {/* PROGRESS */}

          <div className={`${prefix}_Form_Progress`}>
            <div
              className={`${prefix}_Form_Progress_Item`}
              style={{
                backgroundColor: "var(--primary)",
              }}
            />

            <div
              className={`${prefix}_Form_Progress_Item`}
              style={{
                backgroundColor: "var(--primary)",
              }}
            />
          </div>

          {/* EMAIL */}

          <div className={`${prefix}_Form_Label`}>
            {text(
              `Mã OTP đã được gửi đến ${registerEmail}`,
              `OTP has been sent to ${registerEmail}`,
            )}
          </div>

          {/* OTP */}

          <div className={`${prefix}_Form_Otp`} onPaste={handleOtpPaste}>
            {registerOtp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                maxLength={1}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
              />
            ))}
          </div>

          {/* COUNTDOWN / RESEND */}

          {countdown > 0 ? (
            <div className={`${prefix}_Form_Resend`}>
              {text("Gửi lại OTP sau", "Resend OTP after")} {countdown}s
            </div>
          ) : (
            <div
              className={`${prefix}_Form_Resend ${prefix}_Form_Resend_Active`}
              onClick={handleResendOtp}
            >
              {text("Gửi lại OTP", "Resend OTP")}
            </div>
          )}

          {/* MESSAGE */}

          {renderMessage(mobile)}

          {/* VERIFY */}

          <button
            type="submit"
            className={`${prefix}_Form_Submit`}
            disabled={loading}
          >
            {loading
              ? text("Đang xác thực...", "Verifying...")
              : text("Xác thực", "Verify")}
          </button>

          {/* BACK */}

          <button
            type="button"
            className={`${prefix}_Form_Submit`}
            style={{
              marginTop: "10px",

              color: "var(--gray-900)",

              backgroundColor: "var(--gray-300)",
            }}
            onClick={() => {
              clearMessage();

              setAuthMode("register");
            }}
            disabled={loading}
          >
            {text("Quay lại", "Go back")}
          </button>
        </form>
      </div>
    );
  };

  // ============================================================
  // RENDER AUTH CONTENT
  // ============================================================

  const renderContent = (mobile) => {
    switch (authMode) {
      case "register":
        return renderRegister(mobile);

      case "registerOtp":
        return renderRegisterOtp(mobile);

      case "login":
      default:
        return renderLogin(mobile);
    }
  };

  // ============================================================
  // MOBILE
  // ============================================================

  if (isMobile) {
    return (
      <div className="DAT_LoginMobile" style={backgroundStyle}>
        <div className="DAT_LoginMobile_Overlay" />

        <div className="DAT_LoginMobile_Card">{renderContent(true)}</div>

        <div className="DAT_LoginMobile_Footer">
          <span>
            {lang.formatMessage({
              id: "version",
            })}
            : 1.1
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // DESKTOP
  // ============================================================

  return (
    <div className="DAT_Login" style={backgroundStyle}>
      <div className="DAT_Login_Overlay" />

      <div className="DAT_Login_Card">{renderContent(false)}</div>

      <div className="DAT_Login_Footer">
        <span>
          {lang.formatMessage({
            id: "version",
          })}
          : 1.1
        </span>
      </div>
    </div>
  );
}
