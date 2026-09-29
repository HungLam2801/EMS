import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuBell, LuLogOut } from "react-icons/lu";
import { FaEarthAsia } from "react-icons/fa6";
import { useIntl } from "react-intl";
import "./MainHeader.scss";
import { isMobile } from "react-device-detect";
import { RiAlertFill } from "react-icons/ri";
import { useLanguage } from "../../../Lang/LanguageProvider";

export default function MainHeader({ onAlarmClick }) {
  const lang = useIntl();
  const { locale, setLocale } = useLanguage();
  const name = "DAT Admin";
  const roleName = "administrator";
  const image = "";
  const navigate = useNavigate();
  const [showLanMenu, setShowLanMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const userRef = useRef(null);
  const lanRef = useRef(null);
  const alarmRef = useRef(null);

  const currentLanguageLabel = locale === "vi" ? "VI" : "ENG";
  const languageOptions = [
    {
      key: "vi",
      label: lang.formatMessage({ id: "language_vi" }),
      flag: "/img/vie.png",
    },
    {
      key: "en",
      label: lang.formatMessage({ id: "language_en" }),
      flag: "/img/uk.png",
    },
  ];

  const AlarmOptions = [
    {
      key: "A1",
      label: "This is an alert",
      date: "11/06/2026 08:08",
      flag: "",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideUser = userRef.current?.contains(event.target);

      const isInsideLan = lanRef.current?.contains(event.target);

      const isInsideAlarm = alarmRef.current?.contains(event.target);

      if (!isInsideUser && !isInsideLan && !isInsideAlarm) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleChangeLanguage = (nextLang) => {
    setLocale(nextLang);
    setShowLanMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return navigate("/login");
  };

  return (
    <>
      {isMobile ? (
        <header className="DAT_HeaderMobile">
          <div className="DAT_HeaderMobile_Left">
            <img src={"/img/DAT.png"} alt="DAT" />
          </div>
          <div className="DAT_HeaderMobile_Right">
            <div className="DAT_HeaderMobile_Right_Dropdown" ref={lanRef}>
              <button
                type="button"
                className="DAT_HeaderMobile_Right_IconButton"
                onClick={() => setOpenMenu(openMenu === "lan" ? null : "lan")}
                aria-label={lang.formatMessage({
                  id: "common_select_language",
                })}
              >
                <FaEarthAsia />
                <span className="DAT_HeaderMobile_Right_IconButton_Label">
                  {currentLanguageLabel}
                </span>
              </button>
              {openMenu === "lan" && (
                <div className="DAT_HeaderMobile_Right_Dropdown_Menu DAT_HeaderMobile_Right_Dropdown_Menu_Language">
                  {languageOptions.map((option) => (
                    <div
                      key={option.key}
                      className="DAT_HeaderMobile_Right_Dropdown_MenuItem"
                      onClick={() => handleChangeLanguage(option.key)}
                    >
                      <img
                        className="DAT_HeaderMobile_Right_Dropdown_MenuItem_Flag"
                        src={option.flag}
                        alt={option.label}
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="DAT_HeaderMobile_Right_Dropdown" ref={alarmRef}>
              <button
                type="button"
                className="DAT_HeaderMobile_Right_IconButton"
                onClick={() =>
                  setOpenMenu(openMenu === "alarm" ? null : "alarm")
                }
                aria-label={lang.formatMessage({ id: "common_open_alarms" })}
              >
                <LuBell />
                <span className="DAT_HeaderMobile_Right_IconButton_Badge">
                  3
                </span>
              </button>

              {openMenu === "alarm" && (
                <div className="DAT_HeaderMobile_Right_Dropdown_Menu DAT_HeaderMobile_Right_Dropdown_Menu_Alarm">
                  <div className="DAT_HeaderMobile_Right_Dropdown_Header">
                    {lang.formatMessage({ id: "alarm_center" })}
                  </div>
                  <div
                    className="DAT_HeaderMobile_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main">
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Date">
                        11/06/2026
                      </div>
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_HeaderMobile_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item">
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Date">
                        17/06/2026
                      </div>
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_HeaderMobile_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main">
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Date">
                        1/06/2026
                      </div>
                      <div className="DAT_HeaderMobile_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_HeaderMobile_Right_Dropdown_Footer"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    {lang.formatMessage({ id: "view_all_alarm" })}
                  </div>
                </div>
              )}
            </div>
            <div className="DAT_HeaderMobile_Right_Dropdown" ref={userRef}>
              <button
                type="button"
                className="DAT_HeaderMobile_Right_User"
                onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
              >
                <img
                  src={image ? image : "/img/user.png"}
                  className="DAT_HeaderMobile_Right_User_Avatar"
                />
                <div className="DAT_HeaderMobile_Right_User_Info">
                  <div className="DAT_HeaderMobile_Right_User_Info_Name">
                    {name}
                  </div>
                  <div className="DAT_HeaderMobile_Right_User_Info_Role">
                    {roleName}
                  </div>
                </div>
              </button>
              {openMenu === "user" && (
                <div className="DAT_HeaderMobile_Right_Dropdown_Menu DAT_HeaderMobile_Right_Dropdown_Menu_User">
                  <div
                    className="DAT_HeaderMobile_Right_Dropdown_MenuItem"
                    onClick={handleLogout}
                  >
                    <LuLogOut />
                    {lang.formatMessage({ id: "common_logout" })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className="DAT_Header">
          <div className="DAT_Header_Left">
            <h1 className="DAT_Header_Left_Title">
              {lang.formatMessage({ id: "title" })}
            </h1>
          </div>
          <div className="DAT_Header_Right">
            <div className="DAT_Header_Right_Dropdown" ref={lanRef}>
              <button
                type="button"
                className="DAT_Header_Right_IconButton"
                onClick={() => setOpenMenu(openMenu === "lan" ? null : "lan")}
                aria-label={lang.formatMessage({
                  id: "common_select_language",
                })}
              >
                <FaEarthAsia />
                <span className="DAT_Header_Right_IconButton_Label">
                  {currentLanguageLabel}
                </span>
              </button>
              {openMenu === "lan" && (
                <div className="DAT_Header_Right_Dropdown_Menu DAT_Header_Right_Dropdown_Menu_Language">
                  {languageOptions.map((option) => (
                    <div
                      key={option.key}
                      className="DAT_Header_Right_Dropdown_MenuItem"
                      onClick={() => handleChangeLanguage(option.key)}
                    >
                      <img
                        className="DAT_Header_Right_Dropdown_MenuItem_Flag"
                        src={option.flag}
                        alt={option.label}
                      />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="DAT_Header_Right_Dropdown" ref={alarmRef}>
              <button
                type="button"
                className="DAT_Header_Right_IconButton"
                onClick={() =>
                  setOpenMenu(openMenu === "alarm" ? null : "alarm")
                }
                aria-label={lang.formatMessage({ id: "common_open_alarms" })}
              >
                <LuBell />
                <span className="DAT_Header_Right_IconButton_Badge">3</span>
              </button>

              {openMenu === "alarm" && (
                <div className="DAT_Header_Right_Dropdown_Menu DAT_Header_Right_Dropdown_Menu_Alarm">
                  <div className="DAT_Header_Right_Dropdown_Header">
                    {lang.formatMessage({ id: "alarm_center" })}
                  </div>
                  <div
                    className="DAT_Header_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_Header_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_Header_Right_Dropdown_Item_Main">
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Date">
                        11/06/2026
                      </div>
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_Header_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_Header_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_Header_Right_Dropdown_Item_Main">
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Date">
                        17/06/2026
                      </div>
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_Header_Right_Dropdown_Item"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    <div className="DAT_Header_Right_Dropdown_Item_Icon">
                      <RiAlertFill />
                    </div>
                    <div className="DAT_Header_Right_Dropdown_Item_Main">
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Date">
                        1/06/2026
                      </div>
                      <div className="DAT_Header_Right_Dropdown_Item_Main_Title">
                        This is an Alert
                      </div>
                    </div>
                  </div>
                  <div
                    className="DAT_Header_Right_Dropdown_Footer"
                    onClick={() => {
                      navigate("alarm");
                      setOpenMenu(null);
                    }}
                  >
                    {lang.formatMessage({ id: "view_all_alarm" })}
                  </div>
                </div>
              )}
            </div>
            <div className="DAT_Header_Right_Dropdown" ref={userRef}>
              <button
                type="button"
                className="DAT_Header_Right_User"
                onClick={() => setOpenMenu(openMenu === "user" ? null : "user")}
              >
                <img
                  src={image ? image : "/img/user.png"}
                  className="DAT_Header_Right_User_Avatar"
                />
                <div className="DAT_Header_Right_User_Info">
                  <span className="DAT_Header_Right_User_Info_Name">
                    {name}
                  </span>
                  <span className="DAT_Header_Right_User_Info_Role">
                    {roleName}
                  </span>
                </div>
              </button>
              {openMenu === "user" && (
                <div className="DAT_Header_Right_Dropdown_Menu DAT_Header_Right_Dropdown_Menu_User">
                  <div
                    className="DAT_Header_Right_Dropdown_MenuItem"
                    onClick={handleLogout}
                  >
                    <LuLogOut />
                    {lang.formatMessage({ id: "common_logout" })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
