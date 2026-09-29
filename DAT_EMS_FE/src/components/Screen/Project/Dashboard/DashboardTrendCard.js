import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip as ChartTooltip,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line, Bar } from "react-chartjs-2";

import {
  FaBolt,
  FaDroplet,
  FaFireFlameCurved,
  FaLeaf,
  FaDownload,
} from "react-icons/fa6";

import { createMockTrendData, mockFetchData } from "../../../Data/Data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  ChartTooltip,
  zoomPlugin,
);

// ======================================================
// TREND CONFIG
// ======================================================

const trendConfig = {
  electric: {
    instantUnit: "kW",
    accumulatedUnit: "kWh",

    color: "rgba(59, 130, 246, 0.8)",
    solidColor: "rgb(59, 130, 246)",

    instantStepSize: 20,
    instantMax: 80,

    accumulatedStepSize: 5000,
  },

  water: {
    instantUnit: "m³/h",
    accumulatedUnit: "m³",

    color: "rgba(34, 211, 238, 0.8)",
    solidColor: "rgb(34, 211, 238)",

    instantStepSize: 20,
    instantMax: 100,

    accumulatedStepSize: 60,
  },

  gas: {
    instantUnit: "Nm³/h",
    accumulatedUnit: "Nm³",

    color: "rgba(245, 158, 11, 0.8)",
    solidColor: "rgb(245, 158, 11)",

    instantStepSize: 50,
    instantMax: 200,

    accumulatedStepSize: 1000,
  },

  // ====================================================
  // CO2
  // ====================================================

  co2: {
    accumulatedUnit: "tCO₂",

    color: "rgba(52, 211, 153, 0.72)",
    solidColor: "rgb(52, 211, 153)",

    // THÁNG = 30 NGÀY
    month: {
      stepSize: 10,
    },

    // NĂM = 12 THÁNG
    year: {
      stepSize: 200,
    },
  },
};

// ======================================================
// LABELS
// ======================================================

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return formatDateInput(date);
};

const getCurrentMonth = () => getToday().slice(0, 7);

const getMonthEndDate = (monthValue) => {
  const [year, month] = monthValue.split("-").map(Number);
  return formatDateInput(new Date(year, month, 0));
};

const formatTimeLabel = (timestamp) =>
  new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(timestamp));

const formatAccumulatedLabel = (timestamp, period) =>
  new Intl.DateTimeFormat(
    "vi-VN",
    period === "year"
      ? { month: "2-digit" }
      : { day: "2-digit", month: "2-digit" },
  ).format(new Date(timestamp));

// ======================================================
// FORMAT
// ======================================================

const formatAccumulatedValue = (value) => {
  if (value < 1000) {
    return value;
  }

  const result = value / 1000;

  return `${Number.isInteger(result) ? result : result.toFixed(1)}k`;
};

// ======================================================
// BAR HOVER BACKGROUND
// ======================================================

const barHoverBackground = {
  id: "barHoverBackground",

  beforeDatasetsDraw(chart) {
    const activeElements = chart.getActiveElements();

    if (!activeElements.length) {
      return;
    }

    const { ctx, chartArea, scales } = chart;

    const index = activeElements[0].index;

    const xScale = scales.x;

    const center = xScale.getPixelForTick(index);

    const previous = index > 0 ? xScale.getPixelForTick(index - 1) : null;

    const next =
      index < xScale.ticks.length - 1
        ? xScale.getPixelForTick(index + 1)
        : null;

    const left =
      previous !== null
        ? (previous + center) / 2
        : center - (next - center) / 2;

    const right =
      next !== null ? (center + next) / 2 : center + (center - previous) / 2;

    ctx.save();

    ctx.fillStyle = "rgba(226, 232, 240, 0.18)";

    ctx.fillRect(
      left,
      chartArea.top,
      right - left,
      chartArea.bottom - chartArea.top,
    );

    ctx.restore();
  },
};

const instantExtremaLabels = {
  id: "instantExtremaLabels",

  afterDatasetsDraw(chart, _args, options) {
    const values = chart.data.datasets[0]?.data;
    const meta = chart.getDatasetMeta(0);

    if (!values?.length || !meta?.data?.length) return;

    const maximum = Math.max(...values);
    const minimum = Math.min(...values);
    const indexes = [
      ...new Set([values.indexOf(maximum), values.indexOf(minimum)]),
    ];
    const { ctx, chartArea } = chart;

    indexes.forEach((index) => {
      const point = meta.data[index];
      if (!point) return;

      const text = String(values[index]);
      const height = 24;
      const pointer = 8;

      ctx.save();
      ctx.font = "700 11px monospace";
      const width = Math.max(40, ctx.measureText(text).width + 18);
      const left = Math.min(
        Math.max(point.x - width / 2, chartArea.left),
        chartArea.right - width,
      );
      const top = Math.max(2, point.y - height - pointer - 4);
      const tipX = Math.min(Math.max(point.x, left + 8), left + width - 8);

      ctx.beginPath();
      ctx.roundRect(left, top, width, height, 12);
      ctx.globalAlpha = 0.82;
      ctx.fillStyle = options.color || "rgb(59, 130, 246)";
      ctx.shadowColor = options.color || "rgb(59, 130, 246)";
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(tipX - pointer, top + height - 2);
      ctx.quadraticCurveTo(tipX, top + height + 3, point.x, point.y - 1);
      ctx.quadraticCurveTo(
        tipX,
        top + height + 3,
        tipX + pointer,
        top + height - 2,
      );
      ctx.closePath();
      ctx.fillStyle = options.color || "rgb(59, 130, 246)";
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 2;
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, left + width / 2, top + height / 2);
      ctx.restore();
    });
  },
};

// ======================================================
// COMPONENT
// ======================================================

export default function DashboardTrendCard() {
  const lang = useIntl();

  const instantChartRef = useRef(null);
  const accumulatedChartRef = useRef(null);

  const [trendType, setTrendType] = useState("electric");

  const [co2Period, setCo2Period] = useState("month");

  const [accumulatedPeriod, setAccumulatedPeriod] = useState("week");

  const [instantDate, setInstantDate] = useState(getToday());

  const [accumulatedMonth, setAccumulatedMonth] = useState(getCurrentMonth());

  const currentTrend = trendConfig[trendType];

  const isCO2 = trendType === "co2";

  const selectedPeriod = isCO2 ? co2Period : accumulatedPeriod;

  const [mockData, setMockData] = useState(() =>
    createMockTrendData({
      trendType: "electric",
      date: getToday(),
      accumulatedDate: getMonthEndDate(getCurrentMonth()),
      period: "week",
    }),
  );

  useEffect(() => {
    let isCurrentRequest = true;

    mockFetchData({
      trendType,
      date: instantDate,
      accumulatedDate: isCO2
        ? getMonthEndDate(accumulatedMonth)
        : instantDate,
      period: selectedPeriod,
    }).then((response) => {
      if (isCurrentRequest) setMockData(response.data);
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [trendType, instantDate, accumulatedMonth, selectedPeriod]);

  useEffect(() => {
    instantChartRef.current?.resetZoom();
  }, [trendType, instantDate]);

  useEffect(() => {
    accumulatedChartRef.current?.resetZoom();
  }, [trendType, accumulatedMonth, selectedPeriod]);

  const currentCO2Data = isCO2 ? currentTrend[co2Period] : null;

  const currentInstantLabels = mockData.instant.map(({ timestamp }) =>
    formatTimeLabel(timestamp),
  );

  const currentInstantValues = mockData.instant.map(({ value }) => value);

  const currentAccumulatedLabels = mockData.accumulated.map(({ timestamp }) =>
    formatAccumulatedLabel(timestamp, selectedPeriod),
  );

  const accumulatedValues = mockData.accumulated.map(({ value }) => value);

  const actualAccumulatedData = mockData.accumulated.filter(
    ({ isFuture }) => !isFuture,
  );

  const latestDataIndex = mockData.accumulated.reduce(
    (latestIndex, item, index) => (item.isFuture ? latestIndex : index),
    -1,
  );

  const previousValue =
    actualAccumulatedData[actualAccumulatedData.length - 2]?.value;

  const currentValue =
    actualAccumulatedData[actualAccumulatedData.length - 1]?.value;

  const isIncrease =
    previousValue !== undefined && currentValue > previousValue;

  const isDecrease =
    previousValue !== undefined && currentValue < previousValue;

  const changePercent =
    previousValue !== undefined && previousValue !== 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  const percent = Math.abs(changePercent).toFixed(2);

  const comparePeriodSuffix = selectedPeriod === "year" ? "_month" : "";

  const compareText = isIncrease
    ? lang.formatMessage(
        {
          id: `dashboard_trend_increase${comparePeriodSuffix}`,
        },
        {
          percent,
        },
      )
    : isDecrease
      ? lang.formatMessage(
          {
            id: `dashboard_trend_decrease${comparePeriodSuffix}`,
          },
          {
            percent,
          },
        )
      : null;

  const compareColor = isIncrease
    ? "rgb(16, 185, 129)"
    : isDecrease
      ? "rgb(239, 68, 68)"
      : currentTrend.solidColor;

  const instantTrendData = !isCO2
    ? {
        labels: currentInstantLabels,

        datasets: [
          {
            data: currentInstantValues,

            borderColor: currentTrend.solidColor,

            borderWidth: 2,

            pointRadius: 0,

            pointHoverRadius: 4,

            tension: 0.4,

            fill: true,

            backgroundColor: (context) => {
              const { ctx, chartArea } = context.chart;

              if (!chartArea) {
                return currentTrend.color;
              }

              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom,
              );

              gradient.addColorStop(0, currentTrend.color);

              gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

              return gradient;
            },
          },
        ],
      }
    : null;

  const instantTrendOptions = !isCO2
    ? {
        responsive: true,

        maintainAspectRatio: false,

        interaction: {
          mode: "index",
          intersect: false,
        },

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            backgroundColor: "rgb(15, 26, 48)",

            borderColor: "rgb(28, 45, 77)",

            borderWidth: 1,

            titleColor: "rgb(148, 163, 184)",

            bodyColor: "rgb(241, 245, 249)",

            displayColors: false,

            callbacks: {
              label: (context) => `${context.raw} ${currentTrend.instantUnit}`,
            },
          },

          instantExtremaLabels: {
            color: currentTrend.solidColor,
          },

          zoom: {
            limits: {
              x: { minRange: 3 },
            },
            pan: {
              enabled: true,
              mode: "x",
            },
            zoom: {
              wheel: {
                enabled: true,
                speed: 0.08,
              },
              pinch: {
                enabled: true,
              },
              mode: "x",
            },
          },
        },

        layout: {
          padding: {
            top: 38,
          },
        },

        scales: {
          x: {
            border: {
              display: false,
            },

            grid: {
              display: false,
            },

            ticks: {
              color: "rgb(100, 116, 139)",

              font: {
                size: 9,
              },

              callback: function (value, index) {
                return index % 2 === 0 ? this.getLabelForValue(value) : "";
              },
            },

            title: {
              display: true,

              text: lang.formatMessage({
                id: "dashboard_trend_time",
              }),

              color: "rgb(100, 116, 139)",

              font: {
                size: 9,
              },

              padding: {
                top: 12,
              },
            },
          },

          y: {
            beginAtZero: true,

            min: 0,

            max: currentTrend.instantMax,

            border: {
              display: false,
            },

            ticks: {
              stepSize: currentTrend.instantStepSize,

              color: "rgb(100, 116, 139)",

              font: {
                size: 9,
              },
            },

            grid: {
              color: "rgba(148, 163, 184, 0.12)",

              drawTicks: false,
            },

            title: {
              display: true,

              text: currentTrend.instantUnit,

              color: "rgb(203, 213, 225)",

              font: {
                size: 9,
                weight: "bold",
              },
            },
          },
        },
      }
    : null;

  const accumulatedTrendData = {
    labels: currentAccumulatedLabels,

    datasets: [
      {
        data: accumulatedValues,

        backgroundColor: accumulatedValues.map((_, index) => {
          // CO2 LUÔN GIỮ MÀU EMERALD
          if (isCO2) {
            return currentTrend.color;
          }

          // Các loại khác giữ logic cũ
          if (index !== latestDataIndex) {
            return currentTrend.color;
          }

          if (isIncrease) {
            return "rgba(16, 185, 129, 0.9)";
          }

          if (isDecrease) {
            return "rgba(239, 68, 68, 0.9)";
          }

          return currentTrend.color;
        }),

        borderWidth: 0,

        borderRadius: 4,

        borderSkipped: false,

        // CO2 tháng có 30 cột
        maxBarThickness: isCO2
          ? co2Period === "month"
            ? 22
            : 44
          : accumulatedPeriod === "month"
            ? 22
            : 40,

        categoryPercentage: isCO2 ? (co2Period === "month" ? 0.82 : 0.72) : 0.7,

        barPercentage: isCO2 ? (co2Period === "month" ? 0.78 : 0.7) : 0.65,
      },
    ],
  };

  const accumulatedTrendOptions = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    layout: {
      padding: {
        top: 14,
      },
    },

    plugins: {
      legend: {
        display: false,
      },

      datalabels: {
        anchor: "end",

        align: "end",

        offset: 2,

        display: (context) => {
          const values = context.dataset.data;
          const actualIndexes = mockData.accumulated
            .map((item, index) => (item.isFuture ? -1 : index))
            .filter((index) => index >= 0);
          const actualValues = actualIndexes.map((index) => values[index]);
          const maximumIndex = actualIndexes[
            actualValues.indexOf(Math.max(...actualValues))
          ];
          const minimumIndex = actualIndexes[
            actualValues.indexOf(Math.min(...actualValues))
          ];

          return (
            context.dataIndex === maximumIndex ||
            context.dataIndex === minimumIndex
          );
        },

        formatter: (value) => formatAccumulatedValue(value),

        color: (context) => {
          if (isCO2) {
            return currentTrend.solidColor;
          }

          if (context.dataIndex !== latestDataIndex) {
            return currentTrend.solidColor;
          }

          if (isIncrease) {
            return "rgb(16, 185, 129)";
          }

          if (isDecrease) {
            return "rgb(239, 68, 68)";
          }

          return currentTrend.solidColor;
        },

        font: {
          size: 9,
          weight: "700",
        },
      },

      tooltip: {
        backgroundColor: "rgb(15, 26, 48)",

        borderColor: "rgb(28, 45, 77)",

        borderWidth: 1,

        cornerRadius: 8,

        padding: 10,

        titleColor: "rgb(203, 213, 225)",

        bodyColor: "rgb(241, 245, 249)",

        displayColors: false,

        titleFont: {
          size: 11,
          weight: "600",
        },

        bodyFont: {
          size: 12,
          weight: "700",
        },

        callbacks: {
          title: (items) => {
            const label = items[0].label;

            if (!isCO2) {
              return label;
            }

            if (co2Period === "month") {
              return `${lang.formatMessage({
                id: "dashboard_trend_day",
              })} ${label}`;
            }

            return `${lang.formatMessage({
              id: "dashboard_trend_month",
            })} ${label}`;
          },

          label: (context) =>
            `${formatAccumulatedValue(
              context.raw,
            )} ${currentTrend.accumulatedUnit}`,
        },
      },

      zoom: {
        limits: {
          x: { minRange: 3 },
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.08,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },

    scales: {
      x: {
        border: {
          display: false,
        },

        grid: {
          display: false,
        },

        ticks: {
          color: "rgb(100, 116, 139)",

          font: {
            size: 9,
          },

          callback: function (value, index) {
            if (isCO2 && co2Period === "month") {
              return index % 2 === 0 ? this.getLabelForValue(value) : "";
            }

            return this.getLabelForValue(value);
          },
        },

        title: {
          display: true,
          text: lang.formatMessage({
            id:
              selectedPeriod === "year"
                ? "dashboard_trend_month"
                : "dashboard_trend_day",
          }),

          color: "rgb(100, 116, 139)",

          font: {
            size: 9,
          },

          padding: {
            top: 10,
          },
        },
      },

      y: {
        beginAtZero: true,

        border: {
          display: false,
        },

        ticks: {
          stepSize: isCO2
            ? currentCO2Data.stepSize
            : currentTrend.accumulatedStepSize,

          color: "rgb(100, 116, 139)",

          font: {
            size: 9,
          },

          callback: (value) => formatAccumulatedValue(value),
        },

        grid: {
          color: "rgba(148, 163, 184, 0.12)",

          drawTicks: false,
        },

        title: {
          display: true,

          text: currentTrend.accumulatedUnit,

          color: "rgb(203, 213, 225)",

          font: {
            size: 9,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div className="DAT_DashBoard_TrendCard">
      <div className="DAT_DashBoard_TrendCard_Charts">
        {!isCO2 && (
          <>
            <div className="DAT_DashBoard_TrendCard_Charts_Instant">
              <div className="DAT_DashBoard_TrendCard_Charts_Instant_Header">
                <div className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Label">
                  <span className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Title">
                    {lang.formatMessage({ id: "dashboard_trend_instant" })}
                  </span>
                  <span className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Unit">
                    ({currentTrend.instantUnit})
                  </span>
                </div>

                <input
                  className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Date"
                  type="date"
                  value={instantDate}
                  max={getToday()}
                  onChange={(event) => setInstantDate(event.target.value)}
                  aria-label="Chọn ngày"
                />

                <button
                  className="DAT_DashBoard_TrendCard_Charts_Instant_Header_Export"
                  type="button"
                >
                  <FaDownload />
                  Export
                </button>
              </div>

              <div className="DAT_DashBoard_TrendCard_Charts_Instant_Content">
                <Line
                  ref={instantChartRef}
                  data={instantTrendData}
                  options={instantTrendOptions}
                  plugins={[instantExtremaLabels]}
                  onDoubleClick={() => instantChartRef.current?.resetZoom()}
                />
              </div>
            </div>

            <div className="DAT_DashBoard_TrendCard_Charts_Line" />
          </>
        )}

        <div
          className={`DAT_DashBoard_TrendCard_Charts_Accumulated ${
            isCO2 ? "DAT_DashBoard_TrendCard_Charts_Accumulated_CO2" : ""
          }`}
        >
          {/* HEADER */}

          <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header">
            {/* TITLE */}

            <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Title">
              <span>
                {lang.formatMessage({
                  id: "dashboard_trend_accumulated",
                })}
              </span>

              <span className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Title_Unit">
                ({currentTrend.accumulatedUnit})
              </span>
            </div>

            {/* ACTION */}

            <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Actions">
              {/* COMPARE */}

              {compareText && (
                <span
                  className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Compare"
                  style={{
                    color: compareColor,
                  }}
                >
                  {compareText}
                </span>
              )}

              {isCO2 && (
                <input
                  className="DAT_DashBoard_TrendCard_Charts_Accumulated_Header_MonthPicker"
                  type="month"
                  value={accumulatedMonth}
                  max={getCurrentMonth()}
                  onChange={(event) => {
                    if (event.target.value) {
                      setAccumulatedMonth(event.target.value);
                    }
                  }}
                  aria-label="Chọn tháng và năm"
                />
              )}

              {/* PERIOD */}

              <div
                className={`DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_${trendType}`}
              >
                {!isCO2 && (
                  <button
                    type="button"
                    className={`DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item ${
                      accumulatedPeriod === "week"
                        ? "DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item_Active"
                        : ""
                    }`}
                    onClick={() => setAccumulatedPeriod("week")}
                  >
                    {lang.formatMessage({ id: "dashboard_trend_week" })}
                  </button>
                )}

                {/* CO2 MONTH */}
                {isCO2 && (
                  <button
                    type="button"
                    className={`DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item ${
                      co2Period === "month"
                        ? "DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item_Active"
                        : ""
                    }`}
                    onClick={() => setCo2Period("month")}
                  >
                    {lang.formatMessage({
                      id: "dashboard_trend_month",
                    })}
                  </button>
                )}

                {/* YEAR */}

                <button
                  type="button"
                  className={`DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item ${
                    (isCO2 ? co2Period : accumulatedPeriod) === "year"
                      ? "DAT_DashBoard_TrendCard_Charts_Accumulated_Header_Period_Item_Active"
                      : ""
                  }`}
                  onClick={() =>
                    isCO2
                      ? setCo2Period("year")
                      : setAccumulatedPeriod("year")
                  }
                >
                  {lang.formatMessage({
                    id: "dashboard_trend_year",
                  })}
                </button>
              </div>
            </div>
          </div>

          {/* CHART */}

          <div className="DAT_DashBoard_TrendCard_Charts_Accumulated_Content">
            <Bar
              ref={accumulatedChartRef}
              data={accumulatedTrendData}
              options={accumulatedTrendOptions}
              plugins={[ChartDataLabels, barHoverBackground]}
              onDoubleClick={() => accumulatedChartRef.current?.resetZoom()}
            />
          </div>
        </div>
      </div>

      <div className="DAT_DashBoard_TrendCard_Line" />

      <div className="DAT_DashBoard_TrendCard_Switch">
        {/* ELECTRIC */}

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Electric ${
            trendType === "electric"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("electric")}
        >
          <FaBolt />

          {lang.formatMessage({
            id: "dashboard_trend_electric",
          })}
        </button>

        {/* WATER */}

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Water ${
            trendType === "water"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("water")}
        >
          <FaDroplet />

          {lang.formatMessage({
            id: "dashboard_trend_water",
          })}
        </button>

        {/* GAS */}

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_Gas ${
            trendType === "gas"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("gas")}
        >
          <FaFireFlameCurved />

          {lang.formatMessage({
            id: "dashboard_trend_gas",
          })}
        </button>

        {/* CO2 */}

        <button
          type="button"
          className={`DAT_DashBoard_TrendCard_Switch_Item DAT_DashBoard_TrendCard_Switch_Item_CO2 ${
            trendType === "co2"
              ? "DAT_DashBoard_TrendCard_Switch_Item_Active"
              : ""
          }`}
          onClick={() => setTrendType("co2")}
        >
          <FaLeaf />

          {lang.formatMessage({
            id: "dashboard_trend_co2",
          })}
        </button>
      </div>
    </div>
  );
}
