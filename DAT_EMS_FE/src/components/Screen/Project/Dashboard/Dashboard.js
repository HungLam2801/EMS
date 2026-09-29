import "./Dashboard.scss";
import DashboardTrendCard from "./DashboardTrendCard";
import { Tooltip as PrimeTooltip } from "primereact/tooltip";
// import { Tooltip } from "primereact/tooltip";
import { useIntl } from "react-intl";
import {
  FaBolt,
  FaDroplet,
  FaFireFlameCurved,
  FaLeaf,
  FaCircleQuestion,
} from "react-icons/fa6";
import { useState } from "react";
import EnergyTimeChart from "./EnergyTimeChart";
import EnergyConsumption from "./EnergyConsumption";
import EnergyStructure from "./EnergyStructure";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const lang = useIntl();
  const navigate = useNavigate();
  const [metricData, setMetricData] = useState({
    electric: {
      power: 54.0,
      consumption: 1.039,
      co2: 532.4,
    },
    water: {
      flowRate: 48.5,
      volume: 1.24,
      co2: 434.0,
    },
    gas: {
      flowRate: 142.3,
      volume: 8.52,
      co2: 298.6,
    },
    totalCo2: 831.0,
  });

  return (
    <section className="DAT_DashBoard">
      <div className="DAT_DashBoard_TextHeader">
        <button
          className="DAT_DashBoard_TextHeader_BackBtn"
          onClick={() => navigate("/projectmanagement")}
        >
          <LuChevronLeft />
        </button>
        <div className="DAT_DashBoard_TextHeader_Name">
          {lang.formatMessage({ id: "dashboard_title" })}
        </div>
      </div>

      <div className="DAT_DashBoard_MetricCard">
        <div className="DAT_DashBoard_MetricCard_ElectricCard">
          <div className="DAT_DashBoard_MetricCard_ElectricCard_Title">
            <div className="DAT_DashBoard_MetricCard_ElectricCard_Title_IconBox">
              <FaBolt className="DAT_DashBoard_MetricCard_ElectricCard_Title_IconBox_Icon" />
            </div>

            <div className="DAT_DashBoard_MetricCard_ElectricCard_Title_Text">
              {lang.formatMessage({ id: "dashboard_electric_title" })}
            </div>

            <div className="DAT_DashBoard_MetricCard_ElectricCard_Title_Co2Box">
              <img
                src="/img/CO2_tag-CSexam7U.png"
                className="DAT_DashBoard_MetricCard_ElectricCard_Title_Co2Box_Img"
                alt=""
              />

              <div className="DAT_DashBoard_MetricCard_ElectricCard_Title_Co2Box_Text">
                <span>
                  {metricData.electric.co2.toFixed(1).replace(".", ",")}
                </span>
                <span>t</span>
              </div>
            </div>
          </div>

          <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents">
            <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_power" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading_Value">
                  {metricData.electric.power.toFixed(1)}
                </span>

                <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading_Unit">
                  kW
                </span>
              </div>
            </div>

            <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Line" />

            <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_consumption" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading_Value">
                  {metricData.electric.consumption.toFixed(3)}
                </span>

                <span className="DAT_DashBoard_MetricCard_ElectricCard_Contents_Item_Reading_Unit">
                  kWh
                </span>
              </div>
            </div>
          </div>

          <img
            src="/img/card_watermark_e-ClO3UW0v.png"
            className="DAT_DashBoard_MetricCard_ElectricCard_BackgroundIcon"
            alt=""
          />
        </div>

        <div className="DAT_DashBoard_MetricCard_WaterCard">
          <div className="DAT_DashBoard_MetricCard_WaterCard_Title">
            <div className="DAT_DashBoard_MetricCard_WaterCard_Title_IconBox">
              <FaDroplet className="DAT_DashBoard_MetricCard_WaterCard_Title_IconBox_Icon" />
            </div>

            <div className="DAT_DashBoard_MetricCard_WaterCard_Title_Text">
              {lang.formatMessage({ id: "dashboard_water_title" })}
            </div>

            <div className="DAT_DashBoard_MetricCard_WaterCard_Title_Co2Box">
              <img
                src="/img/CO2_tag-CSexam7U.png"
                className="DAT_DashBoard_MetricCard_WaterCard_Title_Co2Box_Img"
                alt=""
              />

              <div className="DAT_DashBoard_MetricCard_WaterCard_Title_Co2Box_Text">
                <span>{metricData.water.co2.toFixed(1).replace(".", ",")}</span>
                <span>t</span>
              </div>
            </div>
          </div>

          <div className="DAT_DashBoard_MetricCard_WaterCard_Contents">
            <div className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_flow_rate" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading_Value">
                  {metricData.water.flowRate.toFixed(1)}
                </span>

                <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading_Unit">
                  m<sup>3</sup>/h
                </span>
              </div>
            </div>

            <div className="DAT_DashBoard_MetricCard_WaterCard_Contents_Line" />

            <div className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_volume" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading_Value">
                  {metricData.water.volume.toFixed(3)}
                </span>

                <span className="DAT_DashBoard_MetricCard_WaterCard_Contents_Item_Reading_Unit">
                  m<sup>3</sup>
                </span>
              </div>
            </div>
          </div>

          <img
            src="/img/card_watermark_w-CN6IFZ4L.png"
            className="DAT_DashBoard_MetricCard_WaterCard_BackgroundIcon"
            alt=""
          />
        </div>

        <div className="DAT_DashBoard_MetricCard_GasCard">
          <div className="DAT_DashBoard_MetricCard_GasCard_Title">
            <div className="DAT_DashBoard_MetricCard_GasCard_Title_IconBox">
              <FaFireFlameCurved className="DAT_DashBoard_MetricCard_GasCard_Title_IconBox_Icon" />
            </div>

            <div className="DAT_DashBoard_MetricCard_GasCard_Title_Text">
              {lang.formatMessage({ id: "dashboard_gas_title" })}
            </div>

            <div className="DAT_DashBoard_MetricCard_GasCard_Title_Co2Box">
              <img
                src="/img/CO2_tag-CSexam7U.png"
                className="DAT_DashBoard_MetricCard_GasCard_Title_Co2Box_Img"
                alt=""
              />

              <div className="DAT_DashBoard_MetricCard_GasCard_Title_Co2Box_Text">
                <span> {metricData.gas.flowRate.toFixed(1)}</span>
                <span>t</span>
              </div>
            </div>
          </div>

          <div className="DAT_DashBoard_MetricCard_GasCard_Contents">
            <div className="DAT_DashBoard_MetricCard_GasCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_flow_rate" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading_Value">
                  {metricData.gas.volume.toFixed(3)}
                </span>

                <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading_Unit">
                  Nm<sup>3</sup>/h
                </span>
              </div>
            </div>

            <div className="DAT_DashBoard_MetricCard_GasCard_Contents_Line" />

            <div className="DAT_DashBoard_MetricCard_GasCard_Contents_Item">
              <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Label">
                {lang.formatMessage({ id: "dashboard_volume" })}
              </span>

              <div className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading">
                <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading_Value">
                  {metricData.totalCo2.toFixed(1).replace(".", ",")}
                </span>

                <span className="DAT_DashBoard_MetricCard_GasCard_Contents_Item_Reading_Unit">
                  Nm<sup>3</sup>
                </span>
              </div>
            </div>
          </div>

          <img
            src="/img/card_watermark_g-B9hyIKZ8.png"
            className="DAT_DashBoard_MetricCard_GasCard_BackgroundIcon"
            alt=""
          />
        </div>

        <div className="DAT_DashBoard_MetricCard_CO2Card">
          <div className="DAT_DashBoard_MetricCard_CO2Card_Title">
            <div className="DAT_DashBoard_MetricCard_CO2Card_Title_IconBox">
              <FaLeaf className="DAT_DashBoard_MetricCard_CO2Card_Title_IconBox_Icon" />
            </div>

            <div className="DAT_DashBoard_MetricCard_CO2Card_Title_Text">
              {lang.formatMessage({ id: "dashboard_co2_title" })}
            </div>

            <FaCircleQuestion className="DAT_DashBoard_MetricCard_CO2Card_Title_HelpIcon" />
          </div>

          <PrimeTooltip
            target=".DAT_DashBoard_MetricCard_CO2Card_Title_HelpIcon"
            position="bottom"
            autoHide={false}
            className="DAT_DashBoard_MetricCard_CO2Card_Tooltip"
          >
            <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content">
              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Header">
                {lang.formatMessage({ id: "dashboard_co2_formula_title" })}
              </div>

              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Electric">
                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Electric_Title">
                  {lang.formatMessage({
                    id: "dashboard_co2_electric_title",
                  })}
                </div>

                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Electric_Box">
                  {lang.formatMessage({
                    id: "dashboard_co2_electric_formula",
                  })}
                </div>
              </div>

              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Water">
                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Water_Title">
                  {lang.formatMessage({
                    id: "dashboard_co2_water_title",
                  })}
                </div>

                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Water_Box">
                  {lang.formatMessage({
                    id: "dashboard_co2_water_formula",
                  })}
                </div>
              </div>

              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Gas">
                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Gas_Title">
                  {lang.formatMessage({
                    id: "dashboard_co2_gas_title",
                  })}
                </div>

                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Gas_Box">
                  {lang.formatMessage({
                    id: "dashboard_co2_gas_formula",
                  })}
                </div>
              </div>

              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Total">
                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Total_Title">
                  {lang.formatMessage({
                    id: "dashboard_co2_total_title",
                  })}
                </div>

                <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Total_Box">
                  {lang.formatMessage({
                    id: "dashboard_co2_total_formula",
                  })}
                </div>
              </div>

              <div className="DAT_DashBoard_MetricCard_CO2Card_Tooltip_Content_Note">
                {lang.formatMessage({ id: "dashboard_co2_note" })}
              </div>
            </div>
          </PrimeTooltip>

          <div className="DAT_DashBoard_MetricCard_CO2Card_Contents">
            <div className="DAT_DashBoard_MetricCard_CO2Card_Contents_Reading">
              <span className="DAT_DashBoard_MetricCard_CO2Card_Contents_Reading_Value">
                831,0
              </span>

              <span className="DAT_DashBoard_MetricCard_CO2Card_Contents_Reading_Unit">
                t
              </span>
            </div>
          </div>

          <img
            src="/img/co2_bg.png"
            className="DAT_DashBoard_MetricCard_CO2Card_BackgroundIcon"
            alt=""
          />
        </div>
      </div>

      <div className="DAT_DashBoard_Overview">
        <div className="DAT_DashBoard_Overview_Box1">
          <div className="DAT_DashBoard_Overview_Box1_ND">
            <div className="DAT_DashBoard_Overview_Box1_ND_Title">
              {lang.formatMessage({ id: "dashboard_energy_mix_title" })}
              <span>103.858 kWh</span>
            </div>

            <div className="DAT_DashBoard_Overview_Box1_ND_Chart">
              <EnergyStructure />
            </div>

            <div className="DAT_DashBoard_Overview_Box1_ND_Show">
              <div className="DAT_DashBoard_Overview_Box1_ND_Show_Left">
                <div className="DAT_DashBoard_Overview_Box1_ND_Show_Left_Title">
                  {lang.formatMessage({ id: "dashboard_bess_charge" })}
                </div>

                <div className="DAT_DashBoard_Overview_Box1_ND_Show_Left_ND">
                  <p>5.840</p>
                  <span>kWh</span>
                </div>
              </div>

              <div className="DAT_DashBoard_Overview_Box1_ND_Show_Right">
                <div className="DAT_DashBoard_Overview_Box1_ND_Show_Right_Title">
                  {lang.formatMessage({ id: "dashboard_bess_discharge" })}
                </div>

                <div className="DAT_DashBoard_Overview_Box1_ND_Show_Right_ND">
                  <p>7.215</p>
                  <span>kWh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="DAT_DashBoard_Overview_Box2">
          <div className="DAT_DashBoard_Overview_Box2_ND">
            <div className="DAT_DashBoard_Overview_Box2_ND_Title">
              {lang.formatMessage({ id: "dashboard_load_breakdown_title" })}
              <span>103.858 kWh</span>
            </div>

            <div className="DAT_DashBoard_Overview_Box2_ND_Chart">
              <EnergyConsumption />
            </div>

            <div className="DAT_DashBoard_Overview_Box2_ND_Chart2">
              <div className="DAT_DashBoard_Overview_Box2_ND_Chart2_Title">
                {lang.formatMessage({
                  id: "dashboard_consumption_time_band_title",
                })}
                <span>103.858 kWh</span>
              </div>

              <div className="DAT_DashBoard_Overview_Box2_ND_Chart2_Chart">
                <EnergyTimeChart />
              </div>
            </div>
          </div>
        </div>

        <div className="DAT_DashBoard_Overview_Box3">
          <div className="DAT_DashBoard_Overview_Box3_ND">
            <div className="DAT_DashBoard_Overview_Box3_ND_Title">
              {lang.formatMessage({
                id: "dashboard_economic_benefits_costs",
              })}
            </div>

            <div className="DAT_DashBoard_Overview_Box3_ND_1">
              <div className="DAT_DashBoard_Overview_Box3_ND_1_Icon">🌱</div>

              <div className="DAT_DashBoard_Overview_Box3_ND_1_Benifit">
                <div className="DAT_DashBoard_Overview_Box3_ND_1_Benifit_Top">
                  {lang.formatMessage({
                    id: "dashboard_solar_economic_benefit",
                  })}
                </div>

                <div className="DAT_DashBoard_Overview_Box3_ND_1_Benifit_Bottom">
                  {lang.formatMessage({
                    id: "dashboard_solar_savings_estimate",
                  })}
                </div>
              </div>

              <div className="DAT_DashBoard_Overview_Box3_ND_1_Money">
                <span>37.44</span>
                <p>{lang.formatMessage({ id: "dashboard_million_vnd" })}</p>
              </div>
            </div>

            <div className="DAT_DashBoard_Overview_Box3_ND_2">
              <div className="DAT_DashBoard_Overview_Box3_ND_2_Left">
                <div className="DAT_DashBoard_Overview_Box3_ND_2_Left_ND">
                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Left_ND_Img">
                    <img src={"/img/EMS_load-ClBUzLYz.png"} alt="" />
                  </div>

                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Left_ND_Title">
                    {lang.formatMessage({
                      id: "dashboard_total_load_cost_today",
                    })}
                  </div>

                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Left_ND_Money">
                    <span>200.1</span>
                    <p>{lang.formatMessage({ id: "dashboard_million_vnd" })}</p>
                  </div>
                </div>
              </div>

              <div className="DAT_DashBoard_Overview_Box3_ND_2_Right">
                <div className="DAT_DashBoard_Overview_Box3_ND_2_Right_ND">
                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Right_ND_Img">
                    <img src={"/img/EMS_grid-DHQDF-vt.png"} alt="" />
                  </div>

                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Right_ND_Title">
                    {lang.formatMessage({
                      id: "dashboard_grid_electricity_cost",
                    })}
                  </div>

                  <div className="DAT_DashBoard_Overview_Box3_ND_2_Right_ND_Money">
                    <span>162.7</span>
                    <p>{lang.formatMessage({ id: "dashboard_million_vnd" })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardTrendCard />
    </section>
  );
}
