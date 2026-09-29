import React, { useMemo, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
} from "chart.js";
// import { callApi } from '../../Api/Api'; // [MOCKED] API call bị comment lại, dùng mock data thay thế

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import "./EnergyReport.scss";
import { useIntl } from "react-intl";
import {
  LuCalendar,
  LuChartNoAxesCombined,
  LuClock,
  LuChevronDown,
  LuZap,
  LuArrowRightFromLine,
  LuArrowLeftToLine,
  LuSettings,
  LuDollarSign,
} from "react-icons/lu";
import { PiExportLight } from "react-icons/pi";
import { isMobile } from "react-device-detect";
// import axios from "axios"; // [MOCKED] Không còn gọi API export excel thật
import {
  getMockDateString,
  mockEnergyReport,
  MOCK_LATEST_DATE,
  mockEnergyReportHourly,
  MOCK_CALCULATE_DATA,
  MOCK_ALL_REPORT,
  MOCK_REPORT_PAGINATION,
} from "../../Data/Data"; // [MOCKED] Dữ liệu mock thay thế cho API thật
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  Filler,
);

/* ==========================================================================
 * [MOCK DATA] - Toàn bộ dữ liệu bên dưới dùng để thay thế cho các API thật:
 *   - POST  /data/calculate                 -> MOCK_CALCULATE_DATA
 *   - POST  /data/getAllReport              -> MOCK_ALL_REPORT
 *   - GET   /data/getAllReportPagination    -> MOCK_REPORT_PAGINATION
 *   - POST  /data/export-excel-today        -> (mô phỏng trong handleExportToDay)
 * Khi tích hợp API thật, chỉ cần bỏ comment lại các đoạn callApi/axios tương ứng
 * và xoá/bỏ qua phần mock bên dưới.
 * ========================================================================== */

const monthNamesVi = [
  "Một",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười Một",
  "Mười Hai",
];
const monthNamesEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortMonthNamesVi = [
  "Thg1",
  "Thg2",
  "Thg3",
  "Thg4",
  "Thg5",
  "Thg6",
  "Thg7",
  "Thg8",
  "Thg9",
  "Thg10",
  "Thg11",
  "Thg12",
];
const shortMonthNamesEn = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function EnergyReport() {
  const lang = useIntl();
  const [viewMode, setViewMode] = useState("day"); // "day" or "month"
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [charge, setCharge] = useState(0);
  const [discharge, setDischarge] = useState(0);
  const [report, setReport] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportPage, setReportPage] = useState([]);

  const latestDate = useMemo(() => {
    if (mockEnergyReport && mockEnergyReport.length > 0) {
      return new Date(mockEnergyReport[0].date);
    }
    return new Date();
  }, []);

  const [selectedDate, setSelectedDate] = useState(latestDate);
  const [navDate, setNavDate] = useState(new Date(latestDate.getTime()));

  const formatToDayMonth = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  const formatHourLabel = (timeStr) => timeStr || "";

  const formattedDateDisplay = useMemo(() => {
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    if (viewMode === "day") {
      return `${dd}/${mm}/${selectedDate.getFullYear()}`;
    } else {
      if (lang.locale === "vi") {
        return `Tháng ${monthNamesVi[selectedDate.getMonth()]}`;
      } else {
        return `${monthNamesEn[selectedDate.getMonth()]}`;
      }
    }
  }, [selectedDate, viewMode, lang]);

  useEffect(() => {
    const getData = async () => {
      try {
        // [MOCKED] API thật bị comment lại, dùng MOCK_CALCULATE_DATA thay thế
        // const res = await callApi(
        //   "post",
        //   `${process.env.REACT_APP_APIDEV}/data/calculate`,
        //   {
        //     date: formattedDateDisplay
        //   }
        // );
        // setCharge(res.data.charge);
        // setDischarge(res.data.discharge);

        const res = { data: MOCK_CALCULATE_DATA };
        setCharge(res.data.charge);
        setDischarge(res.data.discharge);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, [formattedDateDisplay]);
  const handlePrevMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setNavDate(new Date(navDate.getFullYear() - 1, navDate.getMonth(), 1));
  };

  const handleNextYear = () => {
    setNavDate(new Date(navDate.getFullYear() + 1, navDate.getMonth(), 1));
  };

  const getDaysInMonth = () => {
    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    const firstDayInstance = new Date(year, month, 1);

    let startDay = firstDayInstance.getDay();
    if (startDay === 0) startDay = 7;
    const paddingDays = startDay - 1;

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const currentMonthLastDate = new Date(year, month + 1, 0).getDate();

    const cells = [];

    for (let i = paddingDays - 1; i >= 0; i--) {
      const d = prevMonthLastDate - i;
      cells.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(year, month - 1, d),
      });
    }

    for (let i = 1; i <= currentMonthLastDate; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const totalCells = 42;
    const remainingCells = totalCells - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return cells;
  };

  const handleSelectDay = (dayDate) => {
    setSelectedDate(dayDate);
    setShowDropdown(false);
  };

  const handleSelectMonth = (monthIdx) => {
    const newDate = new Date(navDate.getFullYear(), monthIdx, 1);
    setSelectedDate(newDate);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSelectedDate(latestDate);
    setNavDate(new Date(latestDate.getTime()));
    setShowDropdown(false);
  };

  const handleSelectToday = () => {
    setSelectedDate(latestDate);
    setNavDate(new Date(latestDate.getTime()));
    setShowDropdown(false);
  };

  const rows = useMemo(() => {
    if (viewMode === "day") {
      return mockEnergyReportHourly.filter((item) => {
        const d = new Date(item.date);
        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    return mockEnergyReport.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [viewMode, selectedDate]);

  const chartLabels = useMemo(() => {
    if (viewMode === "day") {
      return report.map((item) => formatHourLabel(item.time));
    }

    return report
      .slice()
      .reverse()
      .map((item) => formatToDayMonth(item.date));
  }, [report, viewMode]);
  const chartRows = useMemo(() => {
    if (viewMode === "day") {
      return rows;
    }

    return rows.slice().reverse();
  }, [rows, viewMode]);

  const summary = rows.reduce(
    (acc, row) => ({
      charge: acc.charge + row.charge,
      discharge: acc.discharge + row.discharge,
      pv: acc.pv + row.pv,
      gridImport: acc.gridImport + row.gridImport,
      gridExport: acc.gridExport + row.gridExport,
      load: acc.load + row.load,
      efficiency: acc.efficiency + row.efficiency,
      cycles: acc.cycles + row.cycles,
    }),
    {
      charge: 0,
      discharge: 0,
      pv: 0,
      gridImport: 0,
      gridExport: 0,
      load: 0,
      efficiency: 0,
      cycles: 0,
    },
  );

  const avgEfficiency = rows.length
    ? (summary.efficiency / rows.length).toFixed(1)
    : 0;
  const costSaving = Math.round(summary.discharge * 0.12);
  const revenue = Math.round(summary.gridExport * 0.08);
  const isDayView = viewMode === "day";
  const axisNumberFormatter = new Intl.NumberFormat(
    lang.locale === "vi" ? "vi-VN" : "en-US",
  );

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 18,
          boxHeight: 18,
          usePointStyle: false,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      datalabels: {
        display: false,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // kéo ngang
        },

        zoom: {
          wheel: {
            enabled: true, // lăn chuột để zoom
          },

          pinch: {
            enabled: true, // zoom bằng 2 ngón trên điện thoại
          },

          mode: "x", // chỉ zoom theo trục X
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxRotation: 50,
          minRotation: 50,
          color: "rgba(90, 95, 107, 1)",
        },
        border: {
          color: "rgba(183, 191, 204, 1)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(219, 224, 231, 1)",
          borderDash: [3, 3],
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "rgba(90, 95, 107, 1)",
          callback: (value) => axisNumberFormatter.format(value),
        },
        border: {
          color: "rgba(183, 191, 204, 1)",
        },
      },
    },
  };

  const lineChartOptions = {
    ...commonChartOptions,
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
      line: {
        borderWidth: 2,
      },
    },
  };

  const barChartOptions = {
    ...commonChartOptions,
    datasets: {
      bar: {
        grouped: true,
        categoryPercentage: 0.72,
        barPercentage: 0.82,
      },
    },
  };

  const getAllReportPagination = async (current) => {
    try {
      // [MOCKED] API thật bị comment lại, dùng MOCK_REPORT_PAGINATION thay thế
      // const response = await callApi("get", `${process.env.REACT_APP_APIDEV}/data/getAllReportPagination?date=${formattedDateDisplay}&page=${current}`);
      // if (response.status === false) {
      //   console.log(response.msg);
      // } else {
      //   setReportPage(response.data);
      //   setTotalPage(response.totalPage);
      // };

      const response = { status: true, ...MOCK_REPORT_PAGINATION };
      setReportPage(response.data);
      setTotalPage(response.totalPage);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllReport = async () => {
    try {
      // [MOCKED] API thật bị comment lại, dùng MOCK_ALL_REPORT thay thế
      // const res = await callApi(
      //   "post",
      //   `${process.env.REACT_APP_APIDEV}/data/getAllReport`,
      //   {
      //     date: formattedDateDisplay
      //   }
      // );
      // if (res.status === true) {
      //   setReport(res.data);
      // }

      const res = { status: true, data: MOCK_ALL_REPORT };
      if (res.status === true) {
        setReport(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleExportToDay = async () => {
    try {
      // [MOCKED] API export excel thật bị comment lại
      // const res = await axios.post(`${process.env.REACT_APP_APIDEV}/data/export-excel-today`, {
      //   date: formattedDateDisplay
      // }, {
      //   headers: {
      //     token:
      //       JSON.parse(localStorage.getItem("token")) ||
      //       JSON.parse(sessionStorage.getItem("token")),
      //   },
      //   responseType: "blob",
      // }
      // );
      // const url = window.URL.createObjectURL(res.data);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "Battery_Report_today.xlsx";
      // a.click();
      // window.URL.revokeObjectURL(url);

      // [MOCK] Giả lập xuất file - chỉ log ra console, chưa tải file thật
      console.log("[MOCK] Export excel with date:", formattedDateDisplay);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllReport();
    getAllReportPagination(currentPage);
  }, [formattedDateDisplay, currentPage]);

  const getPagination = (currentPage, totalPages) => {
    const delta = 2; // số trang hiển thị mỗi bên
    const pages = [];

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push("...");
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }
    console.log(pages);
    return pages;
  };

  return (
    <>
      {isMobile ? (
        <div className="DAT_Mobile_Report">
          <div className="DAT_Mobile_Report_Toolbar">
            <div className="DAT_Mobile_Report_Toolbar_Title">
              <div>
                <LuChartNoAxesCombined />
                {lang.formatMessage({ id: "energy_report" })}
              </div>
              <div>
                <PiExportLight />
              </div>
            </div>

            <div className="DAT_Mobile_Report_Toolbar_Actions">
              <div className="DAT_Mobile_Report_Toolbar_Actions_DateGroup">
                <div className="DAT_Mobile_Report_DatePicker_Container">
                  <div
                    className="DAT_Mobile_Report_DatePicker"
                    onClick={() => {
                      setNavDate(new Date(selectedDate.getTime()));
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    <span className="DAT_Mobile_Report_DatePicker_Value">
                      {formattedDateDisplay}
                    </span>
                    <LuCalendar className="DAT_Mobile_Report_DatePicker_Icon" />
                  </div>

                  {showDropdown && (
                    <>
                      <div
                        className="DAT_Mobile_Report_DatePicker_Backdrop"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="DAT_Mobile_Report_CalendarDropdown">
                        <div className="DAT_Mobile_Report_CalendarDropdown_Header">
                          <span className="DAT_Mobile_Report_CalendarDropdown_Header_Title">
                            {viewMode === "day" ? (
                              <>
                                {lang.locale === "vi"
                                  ? `Tháng ${monthNamesVi[navDate.getMonth()]} ${navDate.getFullYear()}`
                                  : `${monthNamesEn[navDate.getMonth()]} ${navDate.getFullYear()}`}{" "}
                                ▾
                              </>
                            ) : (
                              navDate.getFullYear()
                            )}
                          </span>
                          <div className="DAT_Mobile_Report_CalendarDropdown_Header_Nav">
                            <button
                              type="button"
                              className="DAT_Mobile_Report_CalendarDropdown_Header_Nav_Btn"
                              onClick={
                                viewMode === "day"
                                  ? handlePrevMonth
                                  : handlePrevYear
                              }
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="DAT_Mobile_Report_CalendarDropdown_Header_Nav_Btn"
                              onClick={
                                viewMode === "day"
                                  ? handleNextMonth
                                  : handleNextYear
                              }
                            >
                              ↓
                            </button>
                          </div>
                        </div>

                        {viewMode === "day" ? (
                          <>
                            <div className="DAT_Mobile_Report_CalendarDropdown_Weekdays">
                              {lang.locale === "vi" ? (
                                <>
                                  <div>H</div>
                                  <div>B</div>
                                  <div>T</div>
                                  <div>N</div>
                                  <div>S</div>
                                  <div>B</div>
                                  <div>C</div>
                                </>
                              ) : (
                                <>
                                  <div>M</div>
                                  <div>T</div>
                                  <div>W</div>
                                  <div>T</div>
                                  <div>F</div>
                                  <div>S</div>
                                  <div>S</div>
                                </>
                              )}
                            </div>
                            <div className="DAT_Mobile_Report_CalendarDropdown_DaysGrid">
                              {getDaysInMonth().map((cell, idx) => {
                                const isActive =
                                  cell.isCurrentMonth &&
                                  cell.date.getDate() ===
                                    selectedDate.getDate() &&
                                  cell.date.getMonth() ===
                                    selectedDate.getMonth() &&
                                  cell.date.getFullYear() ===
                                    selectedDate.getFullYear();
                                return (
                                  <div
                                    key={idx}
                                    className={`DAT_Mobile_Report_CalendarDropdown_DaysGrid_Cell ${cell.isCurrentMonth ? "CurrentMonth" : "PrevNextMonth"} ${isActive ? "Active" : ""}`}
                                    onClick={() =>
                                      cell.isCurrentMonth &&
                                      handleSelectDay(cell.date)
                                    }
                                  >
                                    {cell.day}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="DAT_Mobile_Report_CalendarDropdown_MonthsGrid">
                            {(lang.locale === "vi"
                              ? shortMonthNamesVi
                              : shortMonthNamesEn
                            ).map((mName, idx) => {
                              const isActive =
                                idx === selectedDate.getMonth() &&
                                navDate.getFullYear() ===
                                  selectedDate.getFullYear();
                              return (
                                <div
                                  key={idx}
                                  className={`DAT_Mobile_Report_CalendarDropdown_MonthsGrid_Cell ${isActive ? "Active" : ""}`}
                                  onClick={() => handleSelectMonth(idx)}
                                >
                                  {mName}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="DAT_Mobile_Report_CalendarDropdown_Footer">
                          <button
                            type="button"
                            className="DAT_Mobile_Report_CalendarDropdown_Footer_Btn"
                            onClick={handleClear}
                          >
                            {lang.locale === "vi" ? "Xóa" : "Clear"}
                          </button>
                          <button
                            type="button"
                            className="DAT_Mobile_Report_CalendarDropdown_Footer_Btn"
                            onClick={handleSelectToday}
                          >
                            {viewMode === "day"
                              ? lang.locale === "vi"
                                ? "Hôm nay"
                                : "Today"
                              : lang.locale === "vi"
                                ? "Tháng này"
                                : "This Month"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="DAT_Mobile_Report_Toggle">
                  <button
                    type="button"
                    className={`DAT_Mobile_Report_Toggle_Btn ${viewMode === "day" ? "Active" : ""}`}
                    onClick={() => setViewMode("day")}
                  >
                    {lang.formatMessage({ id: "day" })}
                  </button>
                  <button
                    type="button"
                    className={`DAT_Mobile_Report_Toggle_Btn ${viewMode === "month" ? "Active" : ""}`}
                    onClick={() => setViewMode("month")}
                  >
                    {lang.formatMessage({ id: "month" })}
                  </button>
                </div>
              </div>

              {/* <button className="DAT_Report_Toolbar_Actions_ImportExcel">{lang.formatMessage({ id: "import_excel" })}</button> */}
              {/* <button className="DAT_Report_Toolbar_Actions_Excel">
                {lang.formatMessage({ id: "export_excel" })}
              </button> */}
            </div>
          </div>

          <div className="DAT_Mobile_Report_Stat">
            <div className="DAT_Mobile_Report_Stat_Box">
              <span className="DAT_Mobile_Report_Stat_Box_Label">
                {lang.formatMessage({ id: "total_charge" })}
              </span>
              <span className="DAT_Mobile_Report_Stat_Box_Value">
                {charge} kWh
              </span>
            </div>
            <div className="DAT_Mobile_Report_Stat_Box">
              <span className="DAT_Mobile_Report_Stat_Box_Label">
                {lang.formatMessage({ id: "total_discharge" })}
              </span>
              <span className="DAT_Mobile_Report_Stat_Box_Value">
                {discharge} kWh
              </span>
            </div>
          </div>

          <div className="DAT_Mobile_Report_Chart">
            <div className="DAT_Mobile_Report_Chart_Container">
              <div className="DAT_Mobile_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "charge" })} /{" "}
                {lang.formatMessage({ id: "discharge" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "charge" }),
                          data: report.map((item) => item.charge),
                          borderColor: "rgba(27, 99, 184, 1)",
                          backgroundColor: "rgba(27, 99, 184, 1)",
                          fill: false,
                          tension: 0,
                        },
                        {
                          label: lang.formatMessage({ id: "discharge" }),
                          data: report.map((item) => item.discharge),
                          borderColor: "rgba(255, 197, 61, 1)",
                          backgroundColor: "rgba(255, 197, 61, 1)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "charge" }),
                          data: report.map((item) => item.charge),
                          backgroundColor: "rgba(18, 144, 201, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                        {
                          label: lang.formatMessage({ id: "discharge" }),
                          data: report.map((item) => item.discharge),
                          backgroundColor: "rgba(255, 197, 61, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>

            <div className="DAT_Mobile_Report_Chart_Container">
              <div className="DAT_Mobile_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "soc" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "soc" }),
                          data: report.map((item) => item.soc),
                          borderColor: "rgba(33, 167, 53, 1)",
                          backgroundColor: "rgba(33, 167, 53, 1)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "soc" }),
                          data: report.map((item) => item.soc),
                          backgroundColor: "rgba(33, 167, 53, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
            <div className="DAT_Mobile_Report_Chart_Container">
              <div className="DAT_Mobile_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "volt" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "volt" }),
                          data: report.map((item) => item.volt),
                          borderColor: "rgb(205, 19, 140)",
                          backgroundColor: "rgb(205, 19, 140)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "volt" }),
                          data: report.map((item) => item.volt),
                          backgroundColor: "rgb(205, 19, 140)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
            <div className="DAT_Mobile_Report_Chart_Container">
              <div className="DAT_Mobile_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "current" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "current" }),
                          data: report.map((item) => item.current),
                          borderColor: "rgb(215, 118, 21)",
                          backgroundColor: "rgb(215, 118, 21)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "current" }),
                          data: report.map((item) => item.current),
                          backgroundColor: "rgb(215, 118, 21)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="DAT_Mobile_Report_Detail">
            <div className="DAT_Mobile_Report_Detail_Header">
              <span className="DAT_Mobile_Report_Detail_Header_Title">
                {lang.formatMessage({ id: "detailed_report_table" })}
              </span>
            </div>
            {report.length ? (
              <div className="DAT_Mobile_Report_Detail_Container">
                <div className="DAT_Mobile_Report_Detail_Container_Cards_Grid">
                  {report.map((row, index) => {
                    const cardKey =
                      viewMode === "day" ? `${row.date}-${row.time}` : row.date;
                    const isExpanded = expandedCard === cardKey;
                    return (
                      <div
                        key={cardKey}
                        className={`DAT_Mobile_Report_Detail_Container_Cards ${isExpanded ? "expanded" : "collapsed"}`}
                      >
                        {/* Header Section */}
                        <div
                          className="DAT_Mobile_Report_Detail_Container_Cards_Header"
                          onClick={() =>
                            setExpandedCard(isExpanded ? null : cardKey)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div className="DAT_Mobile_Report_Detail_Container_Cards_Time">
                            <span className="icon-clock">
                              <LuClock size={20} />
                            </span>
                            <div className="time-info">
                              <span className="time-text">
                                {isDayView
                                  ? formatHourLabel(row.time)
                                  : formatToDayMonth(row.date)}
                              </span>
                              <span className="efficiency-text">
                                {row.soc}% SOC
                              </span>
                              <span className="efficiency-text">
                                {row.soh}% SOH
                              </span>
                            </div>
                          </div>
                          <div
                            className={`expand-icon ${isExpanded ? "expanded" : ""}`}
                          >
                            <LuChevronDown size={18} />
                          </div>
                        </div>

                        {/* Divider line (Thanh ngang) */}
                        {isExpanded && (
                          <div className="DAT_Mobile_Report_Detail_Container_Cards_Thanh"></div>
                        )}

                        {/* Grid Content Section */}
                        {isExpanded && (
                          <div className="DAT_Mobile_Report_Detail_Container_Cards_Container">
                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({ id: "charge" })}
                              </div>
                              <div className="report-item_value">
                                {row.charge} <span className="unit">kWh</span>
                              </div>
                            </div>

                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({ id: "discharge" })}
                              </div>
                              <div className="report-item_value">
                                {row.discharge}{" "}
                                <span className="unit">kWh</span>
                              </div>
                            </div>

                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({ id: "volt" })}
                              </div>
                              <div className="report-item_value">
                                {row.volt} <span className="unit">V</span>
                              </div>
                            </div>

                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({ id: "current" })}
                              </div>
                              <div className="report-item_value">
                                {row.current} <span className="unit">A</span>
                              </div>
                            </div>

                            {/* Row 3: Load & Cost Saving */}
                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({
                                  id: "dashboard_chart_series_grid_import",
                                })}
                              </div>
                              <div className="report-item_value">
                                {row.grid} <span className="unit">Wh</span>
                              </div>
                            </div>

                            <div className="report-item">
                              <div className="report-item_title text-blue">
                                {lang.formatMessage({ id: "load_consumption" })}
                              </div>
                              <div className="report-item_value highlight-blue">
                                {row.load} <span className="unit">Wh</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="DAT_Report_Detail_Empty">
                <div className="DAT_Report_Detail_Empty_Icon">📭</div>
                <div className="DAT_Report_Detail_Empty_Text">
                  No report data
                </div>
                <div className="DAT_Report_Detail_Empty_Sub">
                  Try another time range.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="DAT_Report">
          <div className="DAT_Report_Toolbar">
            <div className="DAT_Report_Toolbar_Title">
              <LuChartNoAxesCombined />
              {lang.formatMessage({ id: "energy_report" })}
            </div>

            <div className="DAT_Report_Toolbar_Actions">
              <div className="DAT_Report_Toolbar_Actions_DateGroup">
                <div className="DAT_Report_DatePicker_Container">
                  <div
                    className="DAT_Report_DatePicker"
                    onClick={() => {
                      setNavDate(new Date(selectedDate.getTime()));
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    <span className="DAT_Report_DatePicker_Value">
                      {formattedDateDisplay}
                    </span>
                    <LuCalendar className="DAT_Report_DatePicker_Icon" />
                  </div>

                  {showDropdown && (
                    <>
                      <div
                        className="DAT_Report_DatePicker_Backdrop"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="DAT_Report_CalendarDropdown">
                        <div className="DAT_Report_CalendarDropdown_Header">
                          <span className="DAT_Report_CalendarDropdown_Header_Title">
                            {viewMode === "day" ? (
                              <>
                                {lang.locale === "vi"
                                  ? `Tháng ${monthNamesVi[navDate.getMonth()]} ${navDate.getFullYear()}`
                                  : `${monthNamesEn[navDate.getMonth()]} ${navDate.getFullYear()}`}{" "}
                                ▾
                              </>
                            ) : (
                              navDate.getFullYear()
                            )}
                          </span>
                          <div className="DAT_Report_CalendarDropdown_Header_Nav">
                            <button
                              type="button"
                              className="DAT_Report_CalendarDropdown_Header_Nav_Btn"
                              onClick={
                                viewMode === "day"
                                  ? handlePrevMonth
                                  : handlePrevYear
                              }
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="DAT_Report_CalendarDropdown_Header_Nav_Btn"
                              onClick={
                                viewMode === "day"
                                  ? handleNextMonth
                                  : handleNextYear
                              }
                            >
                              ↓
                            </button>
                          </div>
                        </div>

                        {viewMode === "day" ? (
                          <>
                            <div className="DAT_Report_CalendarDropdown_Weekdays">
                              {lang.locale === "vi" ? (
                                <>
                                  <div>H</div>
                                  <div>B</div>
                                  <div>T</div>
                                  <div>N</div>
                                  <div>S</div>
                                  <div>B</div>
                                  <div>C</div>
                                </>
                              ) : (
                                <>
                                  <div>M</div>
                                  <div>T</div>
                                  <div>W</div>
                                  <div>T</div>
                                  <div>F</div>
                                  <div>S</div>
                                  <div>S</div>
                                </>
                              )}
                            </div>
                            <div className="DAT_Report_CalendarDropdown_DaysGrid">
                              {getDaysInMonth().map((cell, idx) => {
                                const isActive =
                                  cell.isCurrentMonth &&
                                  cell.date.getDate() ===
                                    selectedDate.getDate() &&
                                  cell.date.getMonth() ===
                                    selectedDate.getMonth() &&
                                  cell.date.getFullYear() ===
                                    selectedDate.getFullYear();
                                return (
                                  <div
                                    key={idx}
                                    className={`DAT_Report_CalendarDropdown_DaysGrid_Cell ${cell.isCurrentMonth ? "CurrentMonth" : "PrevNextMonth"} ${isActive ? "Active" : ""}`}
                                    onClick={() =>
                                      cell.isCurrentMonth &&
                                      handleSelectDay(cell.date)
                                    }
                                  >
                                    {cell.day}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="DAT_Report_CalendarDropdown_MonthsGrid">
                            {(lang.locale === "vi"
                              ? shortMonthNamesVi
                              : shortMonthNamesEn
                            ).map((mName, idx) => {
                              const isActive =
                                idx === selectedDate.getMonth() &&
                                navDate.getFullYear() ===
                                  selectedDate.getFullYear();
                              return (
                                <div
                                  key={idx}
                                  className={`DAT_Report_CalendarDropdown_MonthsGrid_Cell ${isActive ? "Active" : ""}`}
                                  onClick={() => handleSelectMonth(idx)}
                                >
                                  {mName}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="DAT_Report_CalendarDropdown_Footer">
                          <button
                            type="button"
                            className="DAT_Report_CalendarDropdown_Footer_Btn"
                            onClick={handleClear}
                          >
                            {lang.locale === "vi" ? "Xóa" : "Clear"}
                          </button>
                          <button
                            type="button"
                            className="DAT_Report_CalendarDropdown_Footer_Btn"
                            onClick={handleSelectToday}
                          >
                            {viewMode === "day"
                              ? lang.locale === "vi"
                                ? "Hôm nay"
                                : "Today"
                              : lang.locale === "vi"
                                ? "Tháng này"
                                : "This Month"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="DAT_Report_Toggle">
                  <button
                    type="button"
                    className={`DAT_Report_Toggle_Btn ${viewMode === "day" ? "Active" : ""}`}
                    onClick={() => setViewMode("day")}
                  >
                    {lang.formatMessage({ id: "day" })}
                  </button>
                  <button
                    type="button"
                    className={`DAT_Report_Toggle_Btn ${viewMode === "month" ? "Active" : ""}`}
                    onClick={() => setViewMode("month")}
                  >
                    {lang.formatMessage({ id: "month" })}
                  </button>
                </div>
              </div>

              {/* <button className="DAT_Report_Toolbar_Actions_ImportExcel">{lang.formatMessage({ id: "import_excel" })}</button> */}
              <button
                className="DAT_Report_Toolbar_Actions_Excel"
                onClick={handleExportToDay}
              >
                {lang.formatMessage({ id: "export_excel" })}
              </button>
            </div>
          </div>

          <div className="DAT_Report_Stat">
            <div className="DAT_Report_Stat_Box">
              <span className="DAT_Report_Stat_Box_Label">
                {lang.formatMessage({ id: "total_charge" })}
              </span>
              <span className="DAT_Report_Stat_Box_Value">
                {isDayView ? charge : 622.03} kWh
              </span>
            </div>
            <div className="DAT_Report_Stat_Box">
              <span className="DAT_Report_Stat_Box_Label">
                {lang.formatMessage({ id: "total_discharge" })}
              </span>
              <span className="DAT_Report_Stat_Box_Value">
                {isDayView ? discharge : 233.09} kWh
              </span>
            </div>
          </div>

          <div className="DAT_Report_Chart">
            <div className="DAT_Report_Chart_Container">
              <div className="DAT_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "charge" })} /{" "}
                {lang.formatMessage({ id: "discharge" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "charge" }),
                          data: report.map((item) => item.charge),
                          borderColor: "rgba(27, 99, 184, 1)",
                          backgroundColor: "rgba(27, 99, 184, 1)",
                          fill: false,
                          tension: 0,
                        },
                        {
                          label: lang.formatMessage({ id: "discharge" }),
                          data: report.map((item) => item.discharge),
                          borderColor: "rgba(255, 197, 61, 1)",
                          backgroundColor: "rgba(255, 197, 61, 1)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "charge" }),
                          data: report.map((item) => item.charge),
                          backgroundColor: "rgba(18, 144, 201, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                        {
                          label: lang.formatMessage({ id: "discharge" }),
                          data: chartRows.map((item) => item.discharge),
                          backgroundColor: "rgba(255, 197, 61, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>

            <div className="DAT_Report_Chart_Container">
              <div className="DAT_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "SoC/SoH" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "soc" }),
                          data: report.map((item) => item.soc),
                          borderColor: "rgba(33, 167, 53, 1)",
                          backgroundColor: "rgba(33, 167, 53, 1)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "soc" }),
                          data: report.map((item) => item.soc),
                          backgroundColor: "rgba(33, 167, 53, 1)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
            <div className="DAT_Report_Chart_Container">
              <div className="DAT_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "volt" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "volt" }),
                          data: report.map((item) => item.volt),
                          borderColor: "rgb(205, 19, 140)",
                          backgroundColor: "rgb(205, 19, 140)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "volt" }),
                          data: report.map((item) => item.volt),
                          backgroundColor: "rgb(205, 19, 140)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
            <div className="DAT_Report_Chart_Container">
              <div className="DAT_Report_Chart_Container_Header">
                {lang.formatMessage({ id: "current" })}
              </div>
              <div style={{ width: "100%", height: 280 }}>
                {isDayView ? (
                  <Line
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "current" }),
                          data: report.map((item) => item.current),
                          borderColor: "rgb(215, 118, 21)",
                          backgroundColor: "rgb(215, 118, 21)",
                          fill: false,
                          tension: 0,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                ) : (
                  <Bar
                    data={{
                      labels: chartLabels,
                      datasets: [
                        {
                          label: lang.formatMessage({ id: "volt" }),
                          data: report.map((item) => item.volt),
                          backgroundColor: "rgb(215, 118, 21)",
                          borderRadius: 0,
                          barThickness: 6,
                          maxBarThickness: 8,
                        },
                      ],
                    }}
                    options={barChartOptions}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="DAT_Report_Detail">
            <div className="DAT_Report_Detail_Header">
              <span className="DAT_Report_Detail_Header_Title">
                {lang.formatMessage({ id: "detailed_report_table" })}
              </span>
            </div>
            {rows.length ? (
              <div className="DAT_Report_Detail_Container">
                <table>
                  <thead>
                    <tr>
                      <th>{lang.formatMessage({ id: "date" })}</th>
                      <th>SOC</th>
                      <th>SOH</th>
                      <th>{lang.formatMessage({ id: "charge" })}</th>
                      <th>{lang.formatMessage({ id: "discharge" })}</th>

                      <th>
                        {lang.formatMessage({
                          id: "volt",
                        })}
                      </th>
                      <th>
                        {lang.formatMessage({
                          id: "current",
                        })}
                      </th>
                      <th>
                        {lang.formatMessage({
                          id: "dashboard_chart_series_grid_import",
                        })}
                      </th>
                      <th>{lang.formatMessage({ id: "load_consumption" })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportPage.map((row) => (
                      <tr
                        key={
                          viewMode === "day"
                            ? `${row.date}-${row.time}`
                            : row.date
                        }
                      >
                        <td>
                          {viewMode === "day"
                            ? formatHourLabel(row.time)
                            : formatToDayMonth(row.date)}
                        </td>
                        <td>{row.soc} %</td>
                        <td>{row.soh} %</td>
                        <td>{row.charge} kWh</td>
                        <td>{row.discharge} kWh</td>
                        <td>{row.volt} V</td>
                        <td>{row.current} A</td>
                        <td>{row.grid} kW</td>
                        <td>{row.load} kW</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPage > 1 && (
                  <div className="DAT_Report_Detail_Container_Pagination">
                    <button
                      className="DAT_Report_Detail_Container_Pagination_Btn DAT_Report_Detail_Container_Pagination_Btn--prev"
                      onClick={() =>
                        setCurrentPage(
                          currentPage === 1 ? totalPage : currentPage - 1,
                        )
                      }
                    >
                      &lt;
                    </button>
                    {getPagination(currentPage, totalPage).map((item, index) =>
                      item === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="DAT_Report_Detail_Container_Pagination_Ellipsis"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          className={`DAT_Report_Detail_Container_Pagination_Btn${item === currentPage ? " DAT_Report_Detail_Container_Pagination_Btn--active" : ""}`}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </button>
                      ),
                    )}
                    <button
                      className="DAT_Report_Detail_Container_Pagination_Btn DAT_Report_Detail_Container_Pagination_Btn--next"
                      onClick={() =>
                        setCurrentPage(
                          currentPage == totalPage ? 1 : currentPage + 1,
                        )
                      }
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="DAT_Report_Detail_Empty">
                <div className="DAT_Report_Detail_Empty_Icon">📭</div>
                <div className="DAT_Report_Detail_Empty_Text">
                  No report data
                </div>
                <div className="DAT_Report_Detail_Empty_Sub">
                  Try another time range.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
