import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useIntl } from "react-intl";

import "./EnergyConsumption.scss";

export default function EnergyConsumption() {
  const lang = useIntl();

  const data = [
    {
      id: "airConditioner",
      name: lang.formatMessage({ id: "dashboard_load_air_conditioner" }),
      value: 38.42,
      percent: 37.0,
      color: "rgb(7, 148, 209)",
    },
    {
      id: "lighting",
      name: lang.formatMessage({ id: "dashboard_load_lighting" }),
      value: 12.35,
      percent: 11.9,
      color: "rgb(242, 185, 0)",
    },
    {
      id: "waterPump",
      name: lang.formatMessage({ id: "dashboard_load_water_pump" }),
      value: 8.94,
      percent: 8.6,
      color: "rgb(37, 197, 223)",
    },
    {
      id: "otherDevices",
      name: lang.formatMessage({ id: "dashboard_load_other_devices" }),
      value: 44.148,
      percent: 42.5,
      color: "rgb(139, 92, 246)",
    },
  ];

  const chartData = [
    {
      name: "total",
      airConditioner: data[0].percent,
      lighting: data[1].percent,
      waterPump: data[2].percent,
      otherDevices: data[3].percent,
    },
  ];

  return (
    <div className="EnergyConsumption">
      <div className="EnergyConsumption_Meter">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />

            <Bar
              dataKey="airConditioner"
              stackId="meter"
              fill="rgb(7, 148, 209)"
              barSize={15}
            />

            <Bar
              dataKey="lighting"
              stackId="meter"
              fill="rgb(242, 185, 0)"
              barSize={15}
            />

            <Bar
              dataKey="waterPump"
              stackId="meter"
              fill="rgb(37, 197, 223)"
              barSize={15}
            />

            <Bar
              dataKey="otherDevices"
              stackId="meter"
              fill="rgb(139, 92, 246)"
              barSize={15}
              radius={[0, 10, 10, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="EnergyConsumption_List">
        {data.map((item) => (
          <div className="EnergyConsumption_Item" key={item.id}>
            <div className="EnergyConsumption_Item_Name">
              <span
                className="EnergyConsumption_Item_Dot"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span>{item.name}</span>
            </div>

            <div className="EnergyConsumption_Item_Value">
              {item.value.toFixed(3)}
            </div>

            <div className="EnergyConsumption_Item_Percent">
              {item.percent.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
