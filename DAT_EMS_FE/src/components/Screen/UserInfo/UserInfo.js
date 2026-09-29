import React, { useEffect, useRef, useState } from "react";
import "./UserInfo.scss";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LuUserPen } from "react-icons/lu";
import { useIntl } from "react-intl";
import { toast } from "sonner";
// import { mockData } from "./Data";
import { UserInfoData } from "../../Data/Data";
// ==============================
// API - TẠM COMMENT KHI DÙNG MOCK
// ==============================
// import { callApi } from "../../Api/Api";
// import { SystemContext } from "../../contexts/SystemContext";

export default function UserInfo() {
  const lang = useIntl();
  const fileRef = useRef(null);

  const [userInfo, setUserInfo] = useState(UserInfoData.userInfo);
  const [changeInfor, setChangeInfor] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [editField, setEditField] = useState("");
  const [editFieldLabel, setEditFieldLabel] = useState("");
  const [value, setValue] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(UserInfoData.userInfo.image);
  const [error, setError] = useState("");

  const { name, email, phone, address, notificationEnabled } = userInfo;

  const handleOpenModal = (field, label, currentValue) => {
    setEditField(field);
    setEditFieldLabel(label);
    setValue(currentValue ?? "");
    setChangeInfor(true);
  };

  // ==============================
  // API LOAD USER - TẠM COMMENT
  // ==============================
  /*
  const loadUser = async () => {
    try {
      const res = await callApi(
        "post",
        `${process.env.REACT_APP_API}/data/getUser`,
        {}
      );

      if (res.status === true) {
        // set user data từ API tại đây
      } else {
        toast.error("Error System!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  */

  const handleSave = () => {
    // ==============================
    // API CHANGE USER INFO - TẠM COMMENT
    // ==============================
    /*
    const response = await callApi(
      "post",
      `${process.env.REACT_APP_API}/data/changeUserInfo`,
      {
        action: editField,
        value: value,
      }
    );

    await loadUser();
    */

    // MOCK
    setUserInfo((prev) => ({
      ...prev,
      [editField]: value,
    }));

    setChangeInfor(false);
  };

  const displayValue = (fieldValue) => {
    if (fieldValue === null || fieldValue === undefined) return "--";

    const normalizedValue = String(fieldValue).trim();
    return normalizedValue || "--";
  };

  useEffect(() => {
    if (!changeInfor) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setChangeInfor(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [changeInfor]);

  useEffect(() => {
    if (!changePassword) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        offChangePassword();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [changePassword]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError("");

    if (!passwordCurrent) {
      setError(lang.formatMessage({ id: "alarm_current_password" }));
      return;
    }

    if (!newPassword) {
      setError(lang.formatMessage({ id: "alarm_new_password" }));
      return;
    }

    if (!confirmPassword) {
      setError(lang.formatMessage({ id: "alarm_confirm_password" }));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(lang.formatMessage({ id: "alarm_password_not_match" }));
      return;
    }

    // ==============================
    // API CHANGE PASSWORD - TẠM COMMENT
    // ==============================
    /*
    try {
      const res = await callApi(
        "post",
        `${process.env.REACT_APP_API}/data/changePassword`,
        {
          oldPassword: passwordCurrent,
          newPassword: newPassword,
        }
      );

      if (res.status === false) {
        setError(
          lang.formatMessage({ id: "alarm_wrong_current_password" })
        );
        return;
      }
    } catch (error) {
      setError(
        lang.formatMessage({ id: "alarm_wrong_current_password" })
      );
      return;
    }
    */

    // MOCK
    if (passwordCurrent !== userInfo.password) {
      setError(lang.formatMessage({ id: "alarm_wrong_current_password" }));
      return;
    }

    setUserInfo((prev) => ({
      ...prev,
      password: newPassword,
    }));

    offChangePassword();
  };

  const offChangePassword = () => {
    setPasswordCurrent("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");

    setShowPasswordCurrent(false);
    setShowNewPassword(false);
    setShowPassword(false);

    setChangePassword(false);
  };

  const chooseImage = () => {
    fileRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const upload = () => {
    if (!avatar) {
      toast.error(lang.formatMessage({ id: "toast_update_avatar_error" }));
      return;
    }

    // ==============================
    // API UPLOAD AVATAR - TẠM COMMENT
    // ==============================
    /*
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("username", userInfo.username);

      await callApi(
        "post",
        `${process.env.REACT_APP_APIDEV}/data/uploadAvatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        lang.formatMessage({ id: "toast_update_avatar_success" })
      );
    } catch (err) {
      console.error(err);

      toast.error(
        lang.formatMessage({ id: "toast_update_avatar_error" })
      );
    }
    */

    // MOCK
    setUserInfo((prev) => ({
      ...prev,
      image: preview,
    }));

    toast.success(lang.formatMessage({ id: "toast_update_avatar_success" }));
  };

  const handleRequest = () => {
    toast.success(lang.formatMessage({ id: "toast_request_success" }));
  };

  const handleNotification = () => {
    setUserInfo((prev) => ({
      ...prev,
      notificationEnabled: !prev.notificationEnabled,
    }));
  };

  return (
    <div className="DAT_UserInfor">
      <div className="DAT_UserInfor_Card">
        <div className="DAT_UserInfor_Card_Header">
          <div className="DAT_UserInfor_Card_Header_Icon">
            <LuUserPen size={30} />
          </div>

          <div className="DAT_UserInfor_Card_Header_Title">
            {lang.formatMessage({ id: "user_information" })}
          </div>
        </div>
      </div>

      <div className="DAT_UserInfor_Container">
        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "avatar" })}
            </div>

            <img
              className="DAT_UserInfor_Container_Row_Content_Avt"
              src={preview || "/img/user.png"}
              alt=""
              onClick={chooseImage}
            />

            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={upload}
            aria-label="Change Avatar"
          >
            Upload Avatar
          </div>
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "name" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {displayValue(name)}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={() =>
              handleOpenModal("name", lang.formatMessage({ id: "name" }), name)
            }
            aria-label="Change Name"
          >
            {lang.formatMessage({ id: "change" })}
          </div>
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              Email
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {displayValue(email)}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            style={{ cursor: "not-allowed" }}
          >
            {lang.formatMessage({ id: "readOnly" })}
          </div>
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "phone_number" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {displayValue(phone)}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={() =>
              handleOpenModal(
                "phone",
                lang.formatMessage({ id: "phone_number" }),
                phone,
              )
            }
          >
            {lang.formatMessage({ id: "change" })}
          </div>
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "address" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {displayValue(address)}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={() =>
              handleOpenModal(
                "address",
                lang.formatMessage({ id: "address" }),
                address,
              )
            }
          >
            {lang.formatMessage({ id: "change" })}
          </div>
        </div>

        {changeInfor && (
          <div className="DAT_UserInfor_Modal">
            <div className="DAT_UserInfor_Modal_Container">
              <div className="DAT_UserInfor_Modal_Container_Header">
                <div className="DAT_UserInfor_Modal_Container_Header_Title">
                  {lang.formatMessage({ id: "change" })} {editFieldLabel}
                </div>

                <div className="DAT_UserInfor_Modal_Container_Header_Close">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="25"
                    width="25"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setChangeInfor(false)}
                  >
                    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
                  </svg>
                </div>
              </div>

              <div className="DAT_UserInfor_Modal_Container_Main">
                <input
                  style={{ border: "1px solid #c6c5c580" }}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="DAT_UserInfor_Modal_Container_Foot">
                <button onClick={handleSave}>
                  {lang.formatMessage({ id: "save" })}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "password" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              ********
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={() => setChangePassword(true)}
          >
            {lang.formatMessage({ id: "change_password" })}
          </div>

          {changePassword && (
            <div className="DAT_UserInfor_Modal">
              <form
                className="DAT_UserInfor_Modal_Container"
                onSubmit={handleChangePassword}
              >
                <div className="DAT_UserInfor_Modal_Container_Header">
                  <div className="DAT_UserInfor_Modal_Container_Header_Title">
                    {lang.formatMessage({ id: "change_password_title" })}
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Header_Close">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      height="25"
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={offChangePassword}
                    >
                      <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
                    </svg>
                  </div>
                </div>

                <div className="DAT_UserInfor_Modal_Container_Main">
                  <div className="DAT_UserInfor_Modal_Container_Main_Label">
                    {lang.formatMessage({ id: "current_password" })}
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Main_Box">
                    <input
                      type={showPasswordCurrent ? "text" : "password"}
                      value={passwordCurrent}
                      onChange={(e) => setPasswordCurrent(e.target.value)}
                      placeholder={lang.formatMessage({
                        id: "password_input_current",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordCurrent(!showPasswordCurrent)
                      }
                    >
                      {showPasswordCurrent ? (
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Main_Label">
                    {lang.formatMessage({ id: "new_password" })}
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Main_Box">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={lang.formatMessage({
                        id: "password_input_new",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Main_Label">
                    {lang.formatMessage({ id: "password_confirm" })}
                  </div>

                  <div className="DAT_UserInfor_Modal_Container_Main_Box">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={lang.formatMessage({
                        id: "password_input_confirm",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="DAT_UserInfor_Modal_Container_Main_Error">
                      {error}
                    </div>
                  )}
                </div>

                <div className="DAT_UserInfor_Modal_Container_Foot">
                  <button type="submit">
                    {lang.formatMessage({ id: "save" })}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "system_permissions" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {lang.formatMessage({ id: "notification_permission" })}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={handleRequest}
          >
            {lang.formatMessage({ id: "request" })}
          </div>
        </div>

        <div className="DAT_UserInfor_Container_Row">
          <div className="DAT_UserInfor_Container_Row_Content">
            <div className="DAT_UserInfor_Container_Row_Content_Title">
              {lang.formatMessage({ id: "notification" })}
            </div>

            <div className="DAT_UserInfor_Container_Row_Content_Label">
              {lang.formatMessage({ id: "notification_on_off" })}
            </div>
          </div>

          <div
            className="DAT_UserInfor_Container_Row_Btn"
            onClick={handleNotification}
          >
            {notificationEnabled
              ? lang.formatMessage({ id: "on" })
              : lang.formatMessage({ id: "off" })}
          </div>
        </div>
      </div>
    </div>
  );
}
