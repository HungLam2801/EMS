import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useIntl } from "react-intl";

import "./EnergyTimeChart.scss";

export default function EnergyTimeChart() {
  const lang = useIntl();

  const data = [
    {
      id: "peakHours",
      name: lang.formatMessage({ id: "dashboard_peak_hours" }),
      value: 28.812,
      percent: 27.7,
      color: "rgb(255, 68, 68)",
    },
    {
      id: "normalHours",
      name: lang.formatMessage({ id: "dashboard_normal_hours" }),
      value: 75.046,
      percent: 72.3,
      color: "rgb(7, 148, 209)",
    },
  ];

  return (
    <div className="EnergyTimeChart">
      <div className="EnergyTimeChart_Donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="percent"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={1}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="EnergyTimeChart_List">
        {data.map((item) => (
          <div className="EnergyTimeChart_Item" key={item.id}>
            <div className="EnergyTimeChart_Item_Header">
              <div className="EnergyTimeChart_Item_Name">
                <span
                  className="EnergyTimeChart_Item_Dot"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span>{item.name}</span>
              </div>

              <span className="EnergyTimeChart_Item_Percent">
                {item.percent.toFixed(1)}%
              </span>
            </div>

            <div className="EnergyTimeChart_Item_Progress">
              <div
                className="EnergyTimeChart_Item_Progress_Value"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>

            <div className="EnergyTimeChart_Item_Value">
              {item.value.toFixed(3)} kWh
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
