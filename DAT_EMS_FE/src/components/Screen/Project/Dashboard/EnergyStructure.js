import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useIntl } from "react-intl";

import "./EnergyStructure.scss";

export default function EnergyStructure() {
  const lang = useIntl();

  const data = [
    {
      id: "solar",
      name: lang.formatMessage({ id: "dashboard_energy_solar" }),
      value: 15.24,
      percent: 14.7,
      color: "rgb(245, 158, 11)",
    },
    {
      id: "grid",
      name: lang.formatMessage({ id: "dashboard_energy_grid" }),
      value: 81.403,
      percent: 78.4,
      color: "rgb(7, 148, 209)",
    },
    {
      id: "bessDischarge",
      name: lang.formatMessage({ id: "dashboard_bess_discharge" }),
      value: 7.215,
      percent: 6.9,
      color: "rgb(16, 185, 129)",
    },
  ];

  return (
    <div className="EnergyStructure">
      <div className="EnergyStructure_Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={0}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="EnergyStructure_Data">
        {data.map((item) => (
          <div className="EnergyStructure_Item" key={item.id}>
            <div className="EnergyStructure_Item_Header">
              <div className="EnergyStructure_Item_Name">
                <span
                  className="EnergyStructure_Item_Dot"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span>{item.name}</span>
              </div>

              <span className="EnergyStructure_Item_Percent">
                {item.percent.toFixed(1)}%
              </span>
            </div>

            <div className="EnergyStructure_Item_Progress">
              <div
                className="EnergyStructure_Item_Progress_Value"
                style={{
                  width: `${item.percent}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>

            <div className="EnergyStructure_Item_Value">
              {item.value.toFixed(3)} kWh
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
