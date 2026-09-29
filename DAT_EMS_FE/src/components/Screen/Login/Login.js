import React, { useState, useEffect, useRef } from "react";
import { replace, useNavigate } from "react-router-dom";
import {
  LuEye,
  LuEyeOff,
  LuGlobe,
  LuLock,
  LuUser,
  LuMail,
  LuAccessibility,
} from "react-icons/lu";
import { RiArrowGoBackLine, RiLockPasswordLine } from "react-icons/ri";
import { useLanguage } from "../../Lang/LanguageProvider";
import { useIntl } from "react-intl";

import "./Login.scss";
// import { callApi } from "../../Api/Api";
import { isMobile } from "react-device-detect";

const DEMO_ACCOUNT = {
  username: "demo_user",
  password: "abc12345",
  token: "trial-local-token",
};

export default function Login() {
  const lang = useIntl();
  const { locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(7, 15, 32, 0.28), rgba(7, 15, 32, 0.42)), url(https://embody.com.vn/BG/728_0/1/tontaynam.jpg)`,
  };
  const handleChangeLanguage = () => {
    setLocale(locale === "vi" ? "en" : "vi");
  };
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef([]);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
  }, [isForgotPassword]);

  const login = async (account, password, save) => {
    // API login tạm thời comment để dùng tài khoản cứng.
    // try {
    //   const res = await callApi("post", `${process.env.REACT_APP_API}/data/login`,
    //     {
    //       account: account,
    //       password: password,
    //     }
    //   );
    //
    //   if (res.status === true) {
    //     if (save) {
    //       localStorage.setItem("token", JSON.stringify(res.token));
    //     } else {
    //       sessionStorage.setItem("token", JSON.stringify(res.token));
    //     };
    //     return navigate("/projectmanagement");
    //   }
    // } catch (error) {
    //
    // }

    const isValid =
      account === DEMO_ACCOUNT.username && password === DEMO_ACCOUNT.password;

    if (!isValid) return false;

    const storage = save ? localStorage : sessionStorage;
    storage.setItem("token", JSON.stringify(DEMO_ACCOUNT.token));
    navigate("/projectmanagement");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError(lang.formatMessage({ id: "alarm_username" }));
      return;
    }

    if (!password) {
      setError(lang.formatMessage({ id: "alarm_password" }));
      return;
    }

    setLoading(true);
    const isLoggedIn = await login(identifier, password, remember);
    setLoading(false);

    if (!isLoggedIn) {
      setError(lang.formatMessage({ id: "login_error" }));
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  //   const handleDemoLogin = async () => {
  //     setError("");
  //     setLoading(true);
  //     await login("demo_user", "abc12345", true);
  //     setLoading(false);
  //   };

  //----Test-----
  const handleDemoLogin = () => {
    setError("");
    setLoading(true);

    localStorage.setItem("token", JSON.stringify(DEMO_ACCOUNT.token));

    setLoading(false);

    // Chuyển thẳng vào
    navigate("/projectmanagement");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    if (!email.trim()) {
      setError(lang.formatMessage({ id: "alarm_email" }));
      return;
    }
    // API gửi OTP tạm thời comment để chạy offline.
    // try {
    //   const res = await callApi("post", `${process.env.REACT_APP_API}/data/renderOtp`, {
    //     email: email
    //   });
    //   if (res.status === false) {
    //     setError("Không tìm thấy email trong hệ thống");
    //     return;
    //   } else {
    //     setEmail(email);
    //     setStep(2);
    //     setCountdown(60);
    //
    //   }
    // } catch (error) {
    //   setError(lang.formatMessage({ id: "alarm_email_notfound" }));
    // }

    setEmail(email);
    setStep(2);
    setCountdown(60);
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError("");

    setOtp(["", "", "", "", "", ""]);

    if (otp.some((item) => item === "")) {
      setError(lang.formatMessage({ id: "alarm_otp" }));
      return;
    }
    const otpCode = otp.join("");
    // API xác thực OTP tạm thời comment để chạy offline.
    // try {
    //   const res = await callApi("post", `${process.env.REACT_APP_API}/data/verifyOtp`, {
    //     otp: otpCode
    //   });
    //   if (res.status === false) {
    //     setError(lang.formatMessage({ id: "alarm_wrong_otp" }))
    //   } else {
    //     setStep(3);
    //   }
    // } catch (error) {
    //   setError(lang.formatMessage({ id: "alarm_wrong_otp" }))
    // }

    if (otpCode !== "123456") {
      setError(lang.formatMessage({ id: "alarm_wrong_otp" }));
      return;
    }

    setStep(3);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setError("");

    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (!password) {
      setError(lang.formatMessage({ id: "alarm_new_password" }));
      return;
    }

    if (!confirmPassword) {
      setError(lang.formatMessage({ id: "alarm_confirm_password" }));
      return;
    }

    if (password === confirmPassword) {
      // API đổi mật khẩu tạm thời comment để chạy offline.
      // try {
      //   const res = await callApi("post", `${process.env.REACT_APP_API}/data/changePasswordWithOtp`, {
      //     password: password,
      //     email: email
      //   });
      //
      //   if (res.status === false) {
      //     setError("Error sys")
      //   } else {
      //     setIsForgotPassword(false);
      //     setStep(1);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }

      setIsForgotPassword(false);
      setStep(1);
    } else {
      setError(lang.formatMessage({ id: "alarm_password_not_match" }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpAgain = async () => {
    setCountdown(60);
    // API gửi lại OTP tạm thời comment để chạy offline.
    // const emailOtp = email
    // try {
    //   const res = await callApi("post", `${process.env.REACT_APP_API}/data/renderOtp`, {
    //     email: emailOtp
    //   });
    //   if (res.status === false) {
    //     console.log("Error sys")
    //   } else {
    //     console.log("Otp has sended")
    //   }
    // } catch (error) {
    //   console.log(error);
    //   console.log("Lỗi hệ thống");
    // }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleBack = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setStep(1);
  };

  return (
    <>
      {isMobile ? (
        <div className="DAT_LoginMobile" style={backgroundStyle}>
          <div className="DAT_LoginMobile_Overlay"></div>

          <div className="DAT_LoginMobile_Card">
            {isForgotPassword ? (
              <>
                {step === 1 && (
                  <div className="DAT_ForgotMobile_Card_Inner">
                    <div className="DAT_ForgotMobile_Card_Header">
                      <div
                        className="DAT_ForgotMobile_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <div className="DAT_ForgotMobile_Card_Header_Title">
                        {lang.formatMessage({ id: "forgot_password" })}
                      </div>
                    </div>
                    <form
                      className="DAT_ForgotMobile_Card_Form"
                      onSubmit={handleSubmitEmail}
                    >
                      <div className="DAT_ForgotMobile_Card_Form_Sub">1/3</div>
                      <div
                        className="DAT_ForgotMobile_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "verify_account" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Progress">
                        <div
                          className="DAT_ForgotMobile_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Label">
                        {lang.formatMessage({ id: "input_email" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Field">
                        <span className="DAT_ForgotMobile_Card_Form_Field_Icon">
                          <LuMail />
                        </span>
                        <input
                          type="text"
                          name="email"
                          placeholder="E-mail"
                          autoFocus
                        />
                      </div>
                      {error && (
                        <div className="DAT_LoginMobile_Card_Form_Error">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="DAT_ForgotMobile_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "send" })}
                      </button>
                    </form>
                  </div>
                )}
                {step === 2 && (
                  <div className="DAT_ForgotMobile_Card_Inner">
                    <div className="DAT_ForgotMobile_Card_Header">
                      <div
                        className="DAT_ForgotMobile_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <div className="DAT_ForgotMobile_Card_Header_Title">
                        {lang.formatMessage({ id: "forgot_password" })}
                      </div>
                    </div>
                    <form
                      className="DAT_ForgotMobile_Card_Form"
                      onSubmit={handleSubmitOtp}
                    >
                      <div className="DAT_ForgotMobile_Card_Form_Sub">2/3</div>
                      <div
                        className="DAT_ForgotMobile_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "verify_code" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Progress">
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                        <div
                          className="DAT_ForgotMobile_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Label">
                        {lang.formatMessage({ id: "input_otp" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Otp">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            value={otp[index]}
                            ref={(el) => (otpRefs.current[index] = el)}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            maxLength={1}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          />
                        ))}
                      </div>
                      {countdown > 0 ? (
                        <div className="DAT_ForgotMobile_Card_Form_Resend">
                          {lang.formatMessage({ id: "resend_otp_after" })}{" "}
                          {countdown}s
                        </div>
                      ) : (
                        <div
                          className="DAT_ForgotMobile_Card_Form_Resend DAT_ForgotMobile_Card_Form_Resend_Active"
                          onClick={handleOtpAgain}
                        >
                          {lang.formatMessage({ id: "resend_otp" })}
                        </div>
                      )}
                      {error && (
                        <div className="DAT_LoginMobile_Card_Form_Error">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="DAT_ForgotMobile_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "next" })}
                      </button>
                      <button
                        className="DAT_ForgotMobile_Card_Form_Submit"
                        style={{
                          color: "var(--gray-900)",
                          backgroundColor: "var(--gray-300)",
                        }}
                        onClick={handleBack}
                      >
                        {lang.formatMessage({ id: "go_back" })}
                      </button>
                    </form>
                  </div>
                )}
                {step === 3 && (
                  <div className="DAT_ForgotMobile_Card_Inner">
                    <div className="DAT_ForgotMobile_Card_Header">
                      <div
                        className="DAT_ForgotMobile_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                          setError("");
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <div className="DAT_ForgotMobile_Card_Header_Title">
                        {lang.formatMessage({ id: "forgot_password" })}
                      </div>
                    </div>

                    <form
                      className="DAT_ForgotMobile_Card_Form"
                      onSubmit={handleSubmitPassword}
                    >
                      <div className="DAT_ForgotMobile_Card_Form_Sub">3/3</div>
                      <div
                        className="DAT_ForgotMobile_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "reset_password" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Progress">
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                        <div className="DAT_ForgotMobile_Card_Form_Progress_Item"></div>
                        <div
                          className="DAT_ForgotMobile_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Label">
                        {lang.formatMessage({ id: "new_password" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Field">
                        <span className="DAT_ForgotMobile_Card_Form_Field_Icon">
                          <RiLockPasswordLine />
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder={lang.formatMessage({
                            id: "password_input_new",
                          })}
                          name="password"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="DAT_LoginMobile_Card_Form_Field_Action"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label="Hien hoac an mat khau"
                        >
                          {showNewPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Label">
                        {lang.formatMessage({ id: "confirm_password" })}
                      </div>
                      <div className="DAT_ForgotMobile_Card_Form_Field">
                        <span className="DAT_ForgotMobile_Card_Form_Field_Icon">
                          <RiLockPasswordLine />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={lang.formatMessage({
                            id: "password_input_confirm",
                          })}
                          name="confirmPassword"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="DAT_LoginMobile_Card_Form_Field_Action"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          aria-label="Hien hoac an mat khau"
                        >
                          {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                      {error && (
                        <div className="DAT_LoginMobile_Card_Form_Error">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="DAT_ForgotMobile_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "reset_password" })}
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="DAT_LoginMobile_Card_Inner">
                  <div className="DAT_LoginMobile_Card_Header">
                    <div>{lang.formatMessage({ id: "login_system" })}</div>
                    <button
                      type="button"
                      className="DAT_LoginMobile_Card_Header_Language"
                      onClick={handleChangeLanguage}
                    >
                      <LuGlobe />
                      <span>{locale === "vi" ? "VI" : "EN"}</span>
                    </button>
                  </div>

                  <form
                    className="DAT_LoginMobile_Card_Form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
                    <div className="DAT_LoginMobile_Card_Form_Field">
                      <span className="DAT_LoginMobile_Card_Form_Field_Icon">
                        <LuUser />
                      </span>
                      <input
                        type="text"
                        name="ems_login_identifier"
                        placeholder={lang.formatMessage({ id: "username" })}
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        autoComplete="off"
                        autoFocus
                      />
                    </div>

                    <div className="DAT_LoginMobile_Card_Form_Field">
                      <span className="DAT_LoginMobile_Card_Form_Field_Icon">
                        <LuLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="ems_login_password"
                        placeholder={lang.formatMessage({ id: "password" })}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="DAT_LoginMobile_Card_Form_Field_Action"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Hien hoac an mat khau"
                      >
                        {showPassword ? <LuEyeOff /> : <LuEye />}
                      </button>
                    </div>

                    <label className="DAT_LoginMobile_Card_Form_Remember">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                      />
                      <span>{lang.formatMessage({ id: "save_login" })}</span>
                    </label>

                    {error && (
                      <div className="DAT_LoginMobile_Card_Form_Error">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="DAT_LoginMobile_Card_Form_Submit"
                      disabled={loading}
                    >
                      {loading
                        ? lang.formatMessage({ id: "logining" })
                        : lang.formatMessage({ id: "login" })}
                    </button>

                    <div className="DAT_LoginMobile_Card_Form_button">
                      <div className="DAT_LoginMobile_Card_Form_button_Links">
                        <button type="button" onClick={handleForgotPassword}>
                          {lang.formatMessage({ id: "forgot_password" })}
                        </button>
                      </div>

                      <button
                        type="button"
                        className="DAT_LoginMobile_Card_Form_button_Demo"
                        onClick={handleDemoLogin}
                        disabled={loading}
                      >
                        {lang.formatMessage({ id: "trial_account" })}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="DAT_LoginMobile_Footer">
            <span>{lang.formatMessage({ id: "version" })}: 1.1</span>
            {/* <span>BESS</span> */}
          </div>
        </div>
      ) : (
        <div className="DAT_Login" style={backgroundStyle}>
          <div className="DAT_Login_Overlay"></div>

          <div className="DAT_Login_Card">
            {isForgotPassword ? (
              <>
                {step === 1 && (
                  <div className="DAT_Forgot_Card_Inner">
                    <div className="DAT_Forgot_Card_Header">
                      <div
                        className="DAT_Forgot_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <h1 style={{ textTransform: "uppercase" }}>
                        {lang.formatMessage({ id: "forgot_password" })}
                      </h1>
                    </div>
                    <form
                      className="DAT_Forgot_Card_Form"
                      onSubmit={handleSubmitEmail}
                    >
                      <div className="DAT_Forgot_Card_Form_Sub">1/3</div>
                      <div
                        className="DAT_Forgot_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "verify_account" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Progress">
                        <div
                          className="DAT_Forgot_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                      </div>
                      <div className="DAT_Forgot_Card_Form_Label">
                        {lang.formatMessage({ id: "input_email" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Field">
                        <span className="DAT_Forgot_Card_Form_Field_Icon">
                          <LuMail />
                        </span>
                        <input
                          type="text"
                          name="email"
                          placeholder="E-mail"
                          autoFocus
                        />
                      </div>
                      {error && (
                        <div className="DAT_Login_Card_Form_Error">{error}</div>
                      )}

                      <button
                        type="submit"
                        className="DAT_Forgot_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "send" })}
                      </button>
                    </form>
                  </div>
                )}
                {step === 2 && (
                  <div className="DAT_Forgot_Card_Inner">
                    <div className="DAT_Forgot_Card_Header">
                      <div
                        className="DAT_Forgot_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <h1 style={{ textTransform: "uppercase" }}>
                        {lang.formatMessage({ id: "forgot_password" })}
                      </h1>
                    </div>
                    <form
                      className="DAT_Forgot_Card_Form"
                      onSubmit={handleSubmitOtp}
                    >
                      <div className="DAT_Forgot_Card_Form_Sub">2/3</div>
                      <div
                        className="DAT_Forgot_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "verify_code" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Progress">
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                        <div
                          className="DAT_Forgot_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                      </div>
                      <div className="DAT_Forgot_Card_Form_Label">
                        {lang.formatMessage({ id: "input_otp" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Otp">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            value={otp[index]}
                            ref={(el) => (otpRefs.current[index] = el)}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            maxLength={1}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          />
                        ))}
                      </div>
                      {countdown > 0 ? (
                        <div className="DAT_Forgot_Card_Form_Resend">
                          {lang.formatMessage({ id: "resend_otp_after" })}{" "}
                          {countdown}s
                        </div>
                      ) : (
                        <div
                          className="DAT_Forgot_Card_Form_Resend DAT_Forgot_Card_Form_Resend_Active"
                          onClick={handleOtpAgain}
                        >
                          {lang.formatMessage({ id: "resend_otp" })}
                        </div>
                      )}
                      {error && (
                        <div className="DAT_Login_Card_Form_Error">{error}</div>
                      )}

                      <button
                        type="submit"
                        className="DAT_Forgot_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "next" })}
                      </button>
                      <button
                        className="DAT_Forgot_Card_Form_Submit"
                        style={{
                          color: "var(--gray-900)",
                          backgroundColor: "var(--gray-300)",
                        }}
                        onClick={handleBack}
                      >
                        {lang.formatMessage({ id: "go_back" })}
                      </button>
                    </form>
                  </div>
                )}
                {step === 3 && (
                  <div className="DAT_Forgot_Card_Inner">
                    <div className="DAT_Forgot_Card_Header">
                      <div
                        className="DAT_Forgot_Card_Header_Back"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setStep(1);
                          setError("");
                        }}
                      >
                        <RiArrowGoBackLine />
                      </div>
                      <h1 style={{ textTransform: "uppercase" }}>
                        {lang.formatMessage({ id: "forgot_password" })}
                      </h1>
                    </div>

                    <form
                      className="DAT_Forgot_Card_Form"
                      onSubmit={handleSubmitPassword}
                    >
                      <div className="DAT_Forgot_Card_Form_Sub">3/3</div>
                      <div
                        className="DAT_Forgot_Card_Form_Label"
                        style={{ color: "white" }}
                      >
                        {lang.formatMessage({ id: "reset_password" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Progress">
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                        <div className="DAT_Forgot_Card_Form_Progress_Item"></div>
                        <div
                          className="DAT_Forgot_Card_Form_Progress_Item"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                      </div>
                      <div className="DAT_Forgot_Card_Form_Label">
                        {lang.formatMessage({ id: "new_password" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Field">
                        <span className="DAT_Forgot_Card_Form_Field_Icon">
                          <RiLockPasswordLine />
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder={lang.formatMessage({
                            id: "password_input_new",
                          })}
                          name="password"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="DAT_Login_Card_Form_Field_Action"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label="Hien hoac an mat khau"
                        >
                          {showNewPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                      <div className="DAT_Forgot_Card_Form_Label">
                        {lang.formatMessage({ id: "confirm_password" })}
                      </div>
                      <div className="DAT_Forgot_Card_Form_Field">
                        <span className="DAT_Forgot_Card_Form_Field_Icon">
                          <RiLockPasswordLine />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={lang.formatMessage({
                            id: "password_input_confirm",
                          })}
                          name="confirmPassword"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="DAT_Login_Card_Form_Field_Action"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          aria-label="Hien hoac an mat khau"
                        >
                          {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                        </button>
                      </div>
                      {error && (
                        <div className="DAT_Login_Card_Form_Error">{error}</div>
                      )}

                      <button
                        type="submit"
                        className="DAT_Forgot_Card_Form_Submit"
                      >
                        {lang.formatMessage({ id: "reset_password" })}
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="DAT_Login_Card_Inner">
                  <div className="DAT_Login_Card_Header">
                    <h1>{lang.formatMessage({ id: "login_system" })}</h1>
                    <button
                      type="button"
                      className="DAT_Login_Card_Header_Language"
                      onClick={handleChangeLanguage}
                    >
                      <LuGlobe />
                      <span>{locale === "vi" ? "VI" : "EN"}</span>
                    </button>
                  </div>

                  <form
                    className="DAT_Login_Card_Form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                  >
                    <div className="DAT_Login_Card_Form_Field">
                      <span className="DAT_Login_Card_Form_Field_Icon">
                        <LuUser />
                      </span>
                      <input
                        type="text"
                        name="ems_login_identifier"
                        placeholder={lang.formatMessage({ id: "username" })}
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        autoComplete="off"
                        autoFocus
                      />
                    </div>

                    <div className="DAT_Login_Card_Form_Field">
                      <span className="DAT_Login_Card_Form_Field_Icon">
                        <LuLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="ems_login_password"
                        placeholder={lang.formatMessage({ id: "password" })}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="DAT_Login_Card_Form_Field_Action"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label="Hien hoac an mat khau"
                      >
                        {showPassword ? <LuEyeOff /> : <LuEye />}
                      </button>
                    </div>

                    <label className="DAT_Login_Card_Form_Remember">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                      />
                      <span>{lang.formatMessage({ id: "save_login" })}</span>
                    </label>

                    {error && (
                      <div className="DAT_Login_Card_Form_Error">{error}</div>
                    )}

                    <button
                      type="submit"
                      className="DAT_Login_Card_Form_Submit"
                      disabled={loading}
                    >
                      {loading
                        ? lang.formatMessage({ id: "logining" })
                        : lang.formatMessage({ id: "login" })}
                    </button>

                    <div className="DAT_Login_Card_Form_Links">
                      <button type="button" onClick={handleForgotPassword}>
                        {lang.formatMessage({ id: "forgot_password" })}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="DAT_Login_Card_Form_Demo"
                      onClick={handleDemoLogin}
                      disabled={loading}
                    >
                      {lang.formatMessage({ id: "trial_account" })}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

          <div className="DAT_Login_Footer">
            <span>{lang.formatMessage({ id: "version" })}: 1.1</span>
            {/* <span>BESS</span> */}
          </div>
        </div>
      )}
    </>
  );
}
