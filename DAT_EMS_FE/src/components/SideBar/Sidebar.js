import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";
import {
  LuBell,
  LuChartNoAxesCombined,
  LuSettings,
  LuUserPen,
  LuUsers,
} from "react-icons/lu";
import { GoLaw, GoProjectRoadmap } from "react-icons/go";
import "./Sidebar.scss";

const menuGroups = [
  {
    labelId: "project_management",
    mobileLabel: "project_management_label",
    mobileIcon: <GoProjectRoadmap />,
    items: [
      {
        path: "/projectmanagement",
        icon: <GoProjectRoadmap />,
        labelId: "project_management",
      },
    ],
  },
  {
    labelId: "sidebar_group_operation",
    mobileLabel: "sidebar_group_operation_label",
    mobileIcon: <LuChartNoAxesCombined />,
    items: [
      {
        path: "/alarm",
        icon: <LuBell />,
        labelId: "sidebar_item_alarm",
      },
      {
        path: "/energy-report",
        icon: <LuChartNoAxesCombined />,
        labelId: "sidebar_item_energy_report",
      },
    ],
  },
  {
    labelId: "sidebar_group_management",
    mobileLabel: "sidebar_group_management_label",
    mobileIcon: <LuSettings />,
    items: [
      {
        path: "/users",
        icon: <LuUsers />,
        labelId: "sidebar_item_user_management",
      },
      {
        path: "/roles",
        icon: <GoLaw />,
        labelId: "sidebar_item_role_management",
      },
      {
        path: "/user-info",
        icon: <LuUserPen />,
        labelId: "sidebar_item_user_info",
      },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const lang = useIntl();
  const [activeMobileGroup, setActiveMobileGroup] = useState(null);

  if (isMobile) {
    return (
      <>
        {activeMobileGroup !== null && (
          <div
            className="DAT_SidebarMobile_Backdrop"
            onClick={() => setActiveMobileGroup(null)}
          />
        )}

        <div className="DAT_SidebarMobile">
          {menuGroups.map((group, index) => {
            const hasSingleItem = group.items.length === 1;

            return (
              <div key={group.labelId} className="DAT_SidebarMobile_Group">
                {!hasSingleItem && activeMobileGroup === index && (
                  <div className="DAT_SidebarMobile_Group_Popup">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "DAT_SidebarMobile_Group_Popup_Item_Active"
                            : "DAT_SidebarMobile_Group_Popup_Item"
                        }
                        onClick={() => setActiveMobileGroup(null)}
                      >
                        <span className="DAT_SidebarMobile_Group_Popup_Item_Icon">
                          {item.icon}
                        </span>
                        <span className="DAT_SidebarMobile_Group_Popup_Item_Label">
                          {lang.formatMessage({ id: item.labelId })}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}

                {hasSingleItem ? (
                  <NavLink
                    to={group.items[0].path}
                    className={({ isActive }) =>
                      isActive
                        ? "DAT_SidebarMobile_Group_Button_Active"
                        : "DAT_SidebarMobile_Group_Button"
                    }
                    onClick={() => setActiveMobileGroup(null)}
                  >
                    <span className="DAT_SidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>
                    <span className="DAT_SidebarMobile_Group_Button_Label">
                      {lang.formatMessage({ id: group.mobileLabel })}
                    </span>
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className={
                      activeMobileGroup === index
                        ? "DAT_SidebarMobile_Group_Button_Active"
                        : "DAT_SidebarMobile_Group_Button"
                    }
                    onClick={() =>
                      setActiveMobileGroup(
                        activeMobileGroup === index ? null : index,
                      )
                    }
                  >
                    <span className="DAT_SidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>
                    <span className="DAT_SidebarMobile_Group_Button_Label">
                      {lang.formatMessage({ id: group.mobileLabel })}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <aside
      className={
        collapsed ? "DAT_Sidebar DAT_Sidebar_Collapsed" : "DAT_Sidebar"
      }
    >
      <div
        className={
          collapsed
            ? "DAT_Sidebar_Logo DAT_Sidebar_Logo_Collapsed"
            : "DAT_Sidebar_Logo"
        }
        onClick={onToggle}
      >
        <img
          className={
            collapsed
              ? "DAT_Sidebar_Logo_Image_Small"
              : "DAT_Sidebar_Logo_Image_Large"
          }
          src={collapsed ? "/img/logoNho.png" : "/img/logoTo.png"}
          alt="DAT EMS"
        />
      </div>

      <nav className="DAT_Sidebar_Nav">
        {menuGroups.map((group) => (
          <div key={group.labelId} className="DAT_Sidebar_Nav_Group">
            {!collapsed && (
              <div className="DAT_Sidebar_Nav_Group_Label">
                {lang.formatMessage({ id: group.labelId })}
              </div>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  collapsed
                    ? isActive
                      ? "DAT_Sidebar_Nav_Group_Item_Collapsed_Active"
                      : "DAT_Sidebar_Nav_Group_Item_Collapsed"
                    : isActive
                      ? "DAT_Sidebar_Nav_Group_Item_Active"
                      : "DAT_Sidebar_Nav_Group_Item"
                }
                title={
                  collapsed ? lang.formatMessage({ id: item.labelId }) : undefined
                }
              >
                <span className="DAT_Sidebar_Nav_Group_Item_Icon">
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="DAT_Sidebar_Nav_Group_Item_Label">
                    {lang.formatMessage({ id: item.labelId })}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
