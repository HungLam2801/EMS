import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";
import { LuLayoutDashboard, LuSettings } from "react-icons/lu";
import { MdElectricBolt, MdOutlineCircleNotifications } from "react-icons/md";
import { GoProjectRoadmap } from "react-icons/go";
import { IoIosWater } from "react-icons/io";
import { FaGripfire } from "react-icons/fa";
import "./ProjectSidebar.scss";

const menuGroups = [
  {
    labelId: "dashboard_overview",
    mobileLabel: "dashboard_overview_label",
    mobileIcon: <LuLayoutDashboard />,
    items: [
      {
        path: "/dashboard",
        icon: <GoProjectRoadmap />,
        labelId: "dashboard_overview",
      },
    ],
  },
  {
    labelId: "sidebar_group_operation",
    mobileLabel: "sidebar_group_operation_label",
    mobileIcon: <MdOutlineCircleNotifications />,
    items: [
      {
        path: "/electric",
        icon: <MdElectricBolt />,
        labelId: "sidebar_item_electric",
      },
      {
        path: "/water",
        icon: <IoIosWater />,
        labelId: "sidebar_item_water",
      },
      {
        path: "/compressed-air",
        icon: <FaGripfire />,
        labelId: "sidebar_item_compressed_air",
      },
    ],
  },
  {
    labelId: "sidebar_group_management",
    mobileLabel: "sidebar_group_management_label",
    mobileIcon: <LuSettings />,
    items: [
      {
        path: "/report",
        icon: <MdOutlineCircleNotifications />,
        labelId: "sidebar_item_alarm_management2",
      },
      {
        path: "/settings",
        icon: <LuSettings />,
        labelId: "sidebar_item_system_settings",
      },
    ],
  },
];

export default function ProjectSidebar({ collapsed, onToggle }) {
  const lang = useIntl();
  const [activeMobileGroup, setActiveMobileGroup] = useState(null);

  if (isMobile) {
    return (
      <>
        {activeMobileGroup !== null && (
          <div
            className="DAT_ProjectSidebarMobile_Backdrop"
            onClick={() => setActiveMobileGroup(null)}
          />
        )}

        <div className="DAT_ProjectSidebarMobile">
          {menuGroups.map((group, index) => {
            const hasSingleItem = group.items.length === 1;

            return (
              <div
                key={group.labelId}
                className="DAT_ProjectSidebarMobile_Group"
              >
                {!hasSingleItem && activeMobileGroup === index && (
                  <div className="DAT_ProjectSidebarMobile_Group_Popup">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "DAT_ProjectSidebarMobile_Group_Popup_Item_Active"
                            : "DAT_ProjectSidebarMobile_Group_Popup_Item"
                        }
                        onClick={() => setActiveMobileGroup(null)}
                      >
                        <span className="DAT_ProjectSidebarMobile_Group_Popup_Item_Icon">
                          {item.icon}
                        </span>
                        <span className="DAT_ProjectSidebarMobile_Group_Popup_Item_Label">
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
                        ? "DAT_ProjectSidebarMobile_Group_Button_Active"
                        : "DAT_ProjectSidebarMobile_Group_Button"
                    }
                    onClick={() => setActiveMobileGroup(null)}
                  >
                    <span className="DAT_ProjectSidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>
                    <span className="DAT_ProjectSidebarMobile_Group_Button_Label">
                      {lang.formatMessage({ id: group.mobileLabel })}
                    </span>
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className={
                      activeMobileGroup === index
                        ? "DAT_ProjectSidebarMobile_Group_Button_Active"
                        : "DAT_ProjectSidebarMobile_Group_Button"
                    }
                    onClick={() =>
                      setActiveMobileGroup(
                        activeMobileGroup === index ? null : index,
                      )
                    }
                  >
                    <span className="DAT_ProjectSidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>
                    <span className="DAT_ProjectSidebarMobile_Group_Button_Label">
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
        collapsed
          ? "DAT_ProjectSidebar DAT_ProjectSidebar_Collapsed"
          : "DAT_ProjectSidebar"
      }
    >
      <div
        className={
          collapsed
            ? "DAT_ProjectSidebar_Logo DAT_ProjectSidebar_Logo_Collapsed"
            : "DAT_ProjectSidebar_Logo"
        }
        onClick={onToggle}
      >
        <img
          className={
            collapsed
              ? "DAT_ProjectSidebar_Logo_Image_Small"
              : "DAT_ProjectSidebar_Logo_Image_Large"
          }
          src={collapsed ? "/img/Embody_APP_28.png" : "/img/Embody_APP_27.png"}
          alt="DAT EMS"
        />
      </div>

      <nav className="DAT_ProjectSidebar_Nav">
        {menuGroups.map((group) => (
          <div key={group.labelId} className="DAT_ProjectSidebar_Nav_Group">
            {!collapsed && (
              <div className="DAT_ProjectSidebar_Nav_Group_Label">
                {lang.formatMessage({ id: group.labelId })}
              </div>
            )}

            {group.items.map((item) => {
              const isSystemSettings =
                item.labelId === "sidebar_item_system_settings";

              const menuItem = (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    collapsed
                      ? isActive
                        ? "DAT_ProjectSidebar_Nav_Group_Item_Collapsed_Active"
                        : "DAT_ProjectSidebar_Nav_Group_Item_Collapsed"
                      : isActive
                        ? "DAT_ProjectSidebar_Nav_Group_Item_Active"
                        : "DAT_ProjectSidebar_Nav_Group_Item"
                  }
                  title={
                    collapsed
                      ? lang.formatMessage({ id: item.labelId })
                      : undefined
                  }
                >
                  <span className="DAT_ProjectSidebar_Nav_Group_Item_Icon">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="DAT_ProjectSidebar_Nav_Group_Item_Label">
                      {lang.formatMessage({ id: item.labelId })}
                    </span>
                  )}
                </NavLink>
              );

              if (!isSystemSettings) {
                return (
                  <React.Fragment key={item.path}>{menuItem}</React.Fragment>
                );
              }

              return (
                <div
                  key={item.path}
                  className="DAT_ProjectSidebar_Nav_Group_Settings"
                >
                  {menuItem}
                  <div className="DAT_ProjectSidebar_Nav_Group_Settings_Popup">
                    <NavLink
                      to="/settings/emission-electricity"
                      className={({ isActive }) =>
                        isActive
                          ? "DAT_ProjectSidebar_Nav_Group_Settings_Popup_Item_Active"
                          : "DAT_ProjectSidebar_Nav_Group_Settings_Popup_Item"
                      }
                    >
                      {lang.formatMessage({
                        id: "sidebar_settings_emission_electricity",
                      })}
                    </NavLink>
                    <NavLink
                      to="/settings/alarm-threshold"
                      className={({ isActive }) =>
                        isActive
                          ? "DAT_ProjectSidebar_Nav_Group_Settings_Popup_Item_Active"
                          : "DAT_ProjectSidebar_Nav_Group_Settings_Popup_Item"
                      }
                    >
                      {lang.formatMessage({
                        id: "sidebar_settings_alarm_threshold",
                      })}
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
