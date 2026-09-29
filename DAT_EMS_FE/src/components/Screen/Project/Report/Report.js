import React from "react";
import { useIntl } from "react-intl";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "./Report.scss";

export default function Report() {
  const lang = useIntl();
  const navigate = useNavigate();

  return (
    <div className="DAT_Report">
      <div className="DAT_Report_Header">
        <button
          className="DAT_Report_Header_BackBtn"
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <div className="DAT_Report_Header_Name">
          {lang.formatMessage({ id: "alarm_report_header" })}
        </div>
      </div>
      <div className="DAT_Report_Body">
        <div className="DAT_Report_Body_Content">
          <div className="DAT_Report_Body_Content_Header">
            <div className="DAT_Report_Body_Content_Header_Text">
              <p>{lang.formatMessage({ id: "alarm_report_title" })}</p>
              <span>{lang.formatMessage({ id: "alarm_report_subtitle" })}</span>
            </div>
            <div className="DAT_Report_Body_Content_Header_Actions">
              <button className="DAT_Report_Body_Content_Header_Actions_Pdf">
                {lang.formatMessage({ id: "alarm_report_pdf" })}
              </button>
              <button className="DAT_Report_Body_Content_Header_Actions_Excel">
                {lang.formatMessage({ id: "alarm_report_excel" })}
              </button>
            </div>
          </div>
          <div className="DAT_Report_Body_Content_Summary">
            <div className="DAT_Report_Body_Content_Summary_Total">
              <p>{lang.formatMessage({ id: "alarm_report_total_energy" })}</p>
              <span>103,9 kWh</span>
            </div>
            <div className="DAT_Report_Body_Content_Summary_Consume">
              <p>{lang.formatMessage({ id: "alarm_report_total_cost" })}</p>
              <span>256.1 M VNĐ</span>
            </div>
            <div className="DAT_Report_Body_Content_Summary_CO2">
              <p>{lang.formatMessage({ id: "alarm_report_co2" })}</p>
              <span>831,0 t</span>
            </div>
            <div className="DAT_Report_Body_Content_Summary_Fail">
              <p>{lang.formatMessage({ id: "alarm_report_device_fail" })}</p>
              <span>5 / 57</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
