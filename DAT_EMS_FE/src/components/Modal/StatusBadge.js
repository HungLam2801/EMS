import React from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaCheck,
  FaCircle,
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaCircleXmark,
  FaClock,
  FaPlug,
  FaRadio,
  FaShield,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { TbAdjustmentsOff, TbBatteryCharging2 } from "react-icons/tb";
import { FiBatteryCharging } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { useIntl } from "react-intl";
import "./StatusBadge.scss";

const badgeMap = {
  Online: "status-badge--success",
  Offline: "status-badge--gray",
  Fault: "status-badge--danger",
  Normal: "status-badge--success",
  Running: "status-badge--primary",
  Charging: "status-badge--cyan",
  Discharging: "status-badge--purple",
  Ready: "status-badge--success",
  Off: "status-badge--purple",
  Warning: "status-badge--warning",
  Critical: "status-badge--danger",
  Alert: "status-badge--danger",
  Notice: "status-badge--warning",
  Standby: "status-badge--gray",
  Connected: "status-badge--success",
  Disconnected: "status-badge--danger",
  Active: "status-badge--danger",
  Acknowledged: "status-badge--warning",
  Cleared: "status-badge--success",
  Pending: "status-badge--warning",
  Sent: "status-badge--primary",
  Accepted: "status-badge--cyan",
  Rejected: "status-badge--danger",
  Failed: "status-badge--danger",
  Timeout: "status-badge--gray",
  Completed: "status-badge--success",
  Inactive: "status-badge--gray",
  Locked: "status-badge--danger",
  Enabled: "status-badge--success",
  Disabled: "status-badge--gray",
  Info: "status-badge--primary",
  Success: "status-badge--success",
  Auto: "status-badge--primary",
  Manual: "status-badge--warning",
  Charge: "status-badge--cyan",
  Discharge: "status-badge--purple",
  Backup: "status-badge--warning",
  Maintenance: "status-badge--gray",
  "Peak Shaving": "status-badge--purple",
  High: "status-badge--danger",
  Low: "status-badge--warning",
  Supplied: "status-badge--success",
  Generating: "status-badge--success",
  Idle: "status-badge--gray",
  Medium: "status-badge--medium",
  Slight: "status-badge--warning",
  Serious: "status-badge--danger"
};

const iconMap = {
  Online: FaRadio,
  Offline: FaCircle,
  Fault: FaShield,
  Normal: FaShield,
  Running: FaRadio,
  Charging: FiBatteryCharging,
  Discharging: TbBatteryCharging2,
  Ready: FaCheck,
  Off: TbAdjustmentsOff,
  Warning: FaTriangleExclamation,
  Critical: FaCircleExclamation,
  Alert: FaCircleExclamation,
  Notice: FaTriangleExclamation,
  Standby: FaCircle,
  Connected: FaPlug,
  Disconnected: FaCircleXmark,
  Active: FaCircleExclamation,
  Acknowledged: FaCheck,
  Cleared: FaCircleCheck,
  Pending: FaClock,
  Sent: LuSend,
  Accepted: FaCircleCheck,
  Rejected: FaCircleXmark,
  Failed: FaCircleXmark,
  Timeout: FaClock,
  Completed: FaCircleCheck,
  Info: FaCircleInfo,
  Success: FaCircleCheck,
  Enabled: FaCircleCheck,
  Disabled: FaXmark,
  Supplied: FaCircleCheck,
  Generating: FaCircleCheck,
  Idle: FaClock,
};

const statusMessageIds = {
  Online: "status_online",
  Offline: "status_offline",
  Fault: "status_fault",
  Normal: "status_normal",
  Running: "status_running",
  Charging: "status_charging",
  Discharging: "status_discharging",
  Warning: "status_warning",
  Critical: "status_critical",
  Alert: "status_alert",
  Notice: "status_notice",
  Standby: "status_standby",
  Connected: "status_connected",
  Disconnected: "status_disconnected",
  Active: "status_active",
  Acknowledged: "status_acknowledged",
  Cleared: "status_cleared",
  Pending: "status_pending",
  Sent: "status_sent",
  Accepted: "status_accepted",
  Rejected: "status_rejected",
  Failed: "status_failed",
  Timeout: "status_timeout",
  Completed: "status_completed",
  Inactive: "status_inactive",
  Locked: "status_locked",
  Enabled: "status_enabled",
  Disabled: "status_disabled",
  Info: "status_info",
  Success: "status_success",
  Auto: "status_auto",
  Manual: "status_manual",
  Charge: "status_charge",
  Discharge: "status_discharge",
  Backup: "status_backup",
  Maintenance: "status_maintenance",
  "Peak Shaving": "status_peak_shaving",
  High: "status_high",
  Low: "status_low",
  Supplied: "status_supplied",
  Generating: "status_generating",
  Idle: "status_idle",
  Medium: "status_medium",
  Serious: "status_serious",
  Slight: "status_slight"
};

export default function StatusBadge({ status }) {
  const lang = useIntl();
  const className = badgeMap[status] || "status-badge--gray";
  const Icon = iconMap[status];
  const messageId = statusMessageIds[status];
  const label = messageId
    ? lang.formatMessage({ id: messageId, defaultMessage: status })
    : status;

  return (
    <span
      className={`status-badge ${className}`}
    >
      {Icon ? <Icon size={12} /> : null}
      {label}
    </span>
  );
}