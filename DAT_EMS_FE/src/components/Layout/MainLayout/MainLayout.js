import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";

import Alarm from "../../Screen/Alarm/Alarm";
import "./MainLayout.scss";
import MainSidebar from "./Sidebar/MainSidebar";
import MainHeader from "./Header/MainHeader";

export default function MainLayout() {
  const lang = useIntl();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleAlarmPanel = () => {
    setIsAlarmModalOpen((prev) => !prev);
  };

  const alarmPanel =
    !isMobile && isAlarmModalOpen ? (
      <div
        className={`DAT_NotificationPanel_Layer ${
          sidebarCollapsed ? "DAT_NotificationPanel_Layer_Collapsed" : ""
        }`}
      >
        <button
          type="button"
          className="DAT_NotificationPanel_Layer_Backdrop"
          onClick={() => setIsAlarmModalOpen(false)}
          aria-label={lang.formatMessage({ id: "modal_close_aria" })}
        />

        <section className="DAT_NotificationPanel">
          <div className="DAT_NotificationPanel_Header">
            <div className="DAT_NotificationPanel_Header_Title">
              {lang.formatMessage({ id: "notification" })}
            </div>
          </div>

          <div className="DAT_NotificationPanel_Body">
            <Alarm asPanel />
          </div>
        </section>
      </div>
    ) : null;
  return (
    <div
      className={
        isMobile
          ? "layoutMobile"
          : `layout ${sidebarCollapsed ? "layout-collapsed" : ""}`
      }
    >
      <MainSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className={isMobile ? "layoutMobile-main" : "layout-main"}>
        <MainHeader
          onMenuToggle={toggleSidebar}
          onAlarmClick={toggleAlarmPanel}
        />

        <main className={isMobile ? "layoutMobile-content" : "layout-content"}>
          <Outlet />
        </main>

        {alarmPanel}
      </div>
    </div>
  );
}
