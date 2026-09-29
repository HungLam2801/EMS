import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";

import "./ProjectLayout.scss";
import ProjectSidebar from "./SidebarPrj/ProjectSidebar";
import ProjectHeader from "./ProjectHeader/ProjectHeader";

export default function ProjectLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className={
        isMobile
          ? "DAT_ProjectLayoutMobile"
          : `DAT_ProjectLayout ${sidebarCollapsed ? "collapsed" : ""}`
      }
    >
      <ProjectSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div
        className={
          isMobile ? "DAT_ProjectLayoutMobile-main" : "DAT_ProjectLayout-main"
        }
      >
        <ProjectHeader onMenuToggle={toggleSidebar} />

        <main
          className={
            isMobile
              ? "DAT_ProjectLayoutMobile-content"
              : "DAT_ProjectLayout-content"
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
