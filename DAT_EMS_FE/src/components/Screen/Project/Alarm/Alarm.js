import React, { useMemo, useRef, useState } from "react";
import { FiCheckCircle, FiEdit3 } from "react-icons/fi";
import { LuChevronLeft } from "react-icons/lu";
import { useIntl } from "react-intl";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import "./Alarm.scss";

const systemConfig = {
  electricity: {
    theme: "electric",
    labelId: "alarm_setting_system_electricity",
    areas: [
      { id: "motor", labelId: "alarm_setting_area_motor" },
      { id: "solar", labelId: "alarm_setting_area_solar" },
      { id: "bess", labelId: "alarm_setting_area_bess" },
    ],
    metrics: [
      {
        labelId: "alarm_setting_metric_power",
        unit: "kW",
        values: [60, 65, 70],
      },
      {
        labelId: "alarm_setting_metric_current",
        unit: "A",
        values: [120, 130, 125],
      },
      {
        labelId: "alarm_setting_metric_voltage",
        unit: "V",
        values: [240, 240, 220],
      },
      {
        labelId: "alarm_setting_metric_motor_speed",
        unit: "RPM",
        values: [2000, 0, 1800],
      },
      {
        labelId: "alarm_setting_metric_motor_temperature",
        unit: "°C",
        values: [80, 60, 75],
      },
    ],
  },
  water: {
    theme: "water",
    labelId: "alarm_setting_system_water",
    areas: [
      { id: "four-pumps", labelId: "alarm_setting_area_four_pumps" },
      { id: "two-pumps", labelId: "alarm_setting_area_two_pumps" },
    ],
    metrics: [
      {
        labelId: "alarm_setting_metric_max_pipe_pressure",
        unit: "Bar",
        values: [6, 5.5],
      },
      {
        labelId: "alarm_setting_metric_min_pipe_pressure",
        unit: "Bar",
        values: [2, 1.5],
      },
      {
        labelId: "alarm_setting_metric_accumulated_flow",
        unit: "m³",
        values: [800, 650],
      },
    ],
  },
  air: {
    theme: "air",
    labelId: "alarm_setting_system_air",
    areas: [
      { id: "greenhouse", labelId: "alarm_setting_area_greenhouse" },
      { id: "workshop", labelId: "alarm_setting_area_workshop" },
    ],
    metrics: [
      {
        labelId: "alarm_setting_metric_max_air_pressure",
        unit: "Bar",
        values: [8.5, 8],
      },
      {
        labelId: "alarm_setting_metric_min_air_pressure",
        unit: "Bar",
        values: [4, 3.5],
      },
      {
        labelId: "alarm_setting_metric_accumulated_flow",
        unit: "Nm³",
        values: [3000, 2600],
      },
    ],
  },
};

const systems = Object.keys(systemConfig);
const UPDATED_AT = "28/11/2025 14:39:22";

export default function Alarm() {
  const lang = useIntl();
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const [activeSystem, setActiveSystem] = useState(systems[0]);
  const [activeArea, setActiveArea] = useState(
    systemConfig[systems[0]].areas[0].id,
  );
  const [editingIndex, setEditingIndex] = useState(null);
  // const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({});
  const rows = useMemo(() => {
    const config = systemConfig[activeSystem];
    const areaIndex = config.areas.findIndex((area) => area.id === activeArea);
    return config.metrics.map((metric, index) => {
      const key = `${activeSystem}-${activeArea}-${index}`;
      return {
        ...metric,
        key,
        enabled: settings[key]?.enabled ?? !(areaIndex === 1 && index === 3),
        threshold: settings[key]?.threshold ?? metric.values[areaIndex],
      };
    });
  }, [activeArea, activeSystem, settings]);

  const updateRow = (key, patch) => {
    // setSaved(false);
    setSettings((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }));
  };

  const selectSystem = (system) => {
    setActiveSystem(system);
    setActiveArea(systemConfig[system].areas[0].id);
    setEditingIndex(null);
  };

  const selectArea = (area) => {
    setActiveArea(area);
    setEditingIndex(null);
  };

  const saveSettings = () => {
    // setSaved(true);
    toastRef.current?.show({
      severity: "success",
      summary: "Success",
      detail: lang.formatMessage({
        id: "system_setting_electricity_price_tier_save_success",
      }),
      life: 3500,
    });
  };

  return (
    <section
      className={`DAT_AlarmSetting DAT_AlarmSetting_${systemConfig[activeSystem].theme}`}
    >
      <Toast
        ref={toastRef}
        position="top-right"
        className="DAT_AlarmSetting_Toast"
      />
      <div className="DAT_AlarmSetting_Header">
        <button
          type="button"
          className="DAT_AlarmSetting_Header_BackBtn"
          aria-label={lang.formatMessage({ id: "alarm_setting_back" })}
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <h1 className="DAT_AlarmSetting_Title">
          {lang.formatMessage({ id: "alarm_setting_title" })}
        </h1>
      </div>

      <div className="DAT_AlarmSetting_Filters">
        <div className="DAT_AlarmSetting_Filters_Systems">
          {systems.map((system) => (
            <button
              key={system}
              type="button"
              className={
                activeSystem === system
                  ? "DAT_AlarmSetting_Filters_Systems_Item_Active"
                  : "DAT_AlarmSetting_Filters_Systems_Item"
              }
              onClick={() => selectSystem(system)}
            >
              {lang.formatMessage({ id: systemConfig[system].labelId })}
            </button>
          ))}
        </div>

        <div className="DAT_AlarmSetting_Filters_Divider" />
        <span className="DAT_AlarmSetting_Filters_Label">
          {lang.formatMessage({ id: "alarm_setting_area" })}:
        </span>

        <div className="DAT_AlarmSetting_Filters_Areas">
          {systemConfig[activeSystem].areas.map((area) => (
            <button
              key={area.id}
              type="button"
              className={
                activeArea === area.id
                  ? "DAT_AlarmSetting_Filters_Areas_Item_Active"
                  : "DAT_AlarmSetting_Filters_Areas_Item"
              }
              onClick={() => selectArea(area.id)}
            >
              <span />
              {lang.formatMessage({ id: area.labelId })}
            </button>
          ))}
        </div>
      </div>

      <div className="DAT_AlarmSetting_Card">
        <div className="DAT_AlarmSetting_Card_Title">
          <strong>
            {lang.formatMessage({ id: "alarm_setting_thresholds" })}
          </strong>{" "}
          <span>{lang.formatMessage({ id: "alarm_setting_for_station" })}</span>
        </div>

        <div className="DAT_AlarmSetting_Card_TableWrap">
          <table className="DAT_AlarmSetting_Card_Table">
            <thead>
              <tr>
                <th>#</th>
                <th>{lang.formatMessage({ id: "alarm_setting_on_off" })}</th>
                <th>
                  {lang.formatMessage({ id: "alarm_setting_metric_name" })}
                </th>
                <th>{lang.formatMessage({ id: "alarm_setting_unit" })}</th>
                <th>
                  {lang.formatMessage({ id: "alarm_setting_updated_time" })}
                </th>
                <th>{lang.formatMessage({ id: "alarm_setting_threshold" })}</th>
                <th>{lang.formatMessage({ id: "alarm_setting_action" })}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.key} className={row.enabled ? "" : "is-disabled"}>
                  <td>{index + 1}</td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.enabled}
                      aria-label={`${lang.formatMessage({
                        id: row.enabled
                          ? "alarm_setting_turn_off"
                          : "alarm_setting_turn_on",
                      })} ${lang.formatMessage({ id: row.labelId })}`}
                      className={
                        row.enabled
                          ? "DAT_AlarmSetting_Switch DAT_AlarmSetting_Switch_On"
                          : "DAT_AlarmSetting_Switch"
                      }
                      onClick={() =>
                        updateRow(row.key, { enabled: !row.enabled })
                      }
                    >
                      <span />
                    </button>
                  </td>
                  <td className="metric-name">
                    {lang.formatMessage({ id: row.labelId })}
                  </td>
                  <td className="metric-unit">{row.unit}</td>
                  <td className="updated-at">{UPDATED_AT}</td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        className="DAT_AlarmSetting_ThresholdInput"
                        type="number"
                        value={row.threshold}
                        autoFocus
                        onChange={(event) =>
                          updateRow(row.key, { threshold: event.target.value })
                        }
                        onBlur={() => setEditingIndex(null)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") setEditingIndex(null);
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className="DAT_AlarmSetting_Threshold"
                        onClick={() => row.enabled && setEditingIndex(index)}
                      >
                        {row.threshold}
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="DAT_AlarmSetting_Edit"
                      aria-label={`${lang.formatMessage({ id: "alarm_setting_edit" })} ${lang.formatMessage({ id: row.labelId })}`}
                      onClick={() => row.enabled && setEditingIndex(index)}
                    >
                      <FiEdit3 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="DAT_AlarmSetting_SaveRow">
        <button
          type="button"
          className="DAT_AlarmSetting_Save"
          onClick={saveSettings}
        >
          <FiCheckCircle />
          {lang.formatMessage({ id: "alarm_setting_save" })}
        </button>
      </div>
    </section>
  );
}
