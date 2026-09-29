import { useIntl } from "react-intl";
import "./SystemSetting.scss";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { createRoot } from "react-dom/client";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";

const emptyElectricityPriceTiers = {
  id: null,
  tierName: "",
  unitPrice: 0,
  timeSlots: [
    {
      startTime: "00:00",
      endTime: "00:00",
    },
  ],
};

const SystemSetting = () => {
  const lang = useIntl();
  const navigate = useNavigate();
  const [co2eConvertFactors, setCo2eConvertFactors] = useState({
    electricity: 0.7222,
    water: 0.35,
    air: 2.1,
  });
  const toastRef = useState(null);
  const [tierDeleteConfirmDialogVisible, setTierDeleteConfirmDialogVisible] =
    useState(false);
  const [currentTierIndexToDelete, setCurrentTierIndexToDelete] =
    useState(null);
  const [currentTimeSlotToDelete, setCurrentTimeSlotToDelete] = useState(null);
  const [
    timeSlotDeleteConfirmDialogVisible,
    setTimeSlotDeleteConfirmDialogVisible,
  ] = useState(false);

  const [electricityPriceTiers, setElectricityPriceTiers] = useState([
    {
      id: 1,
      tierName: "Bậc 1 (Giờ bình thường)",
      unitPrice: 1864,
      timeSlots: [
        {
          startTime: "04:00",
          endTime: "09:30",
        },
        {
          startTime: "11:30",
          endTime: "17:00",
        },
        {
          startTime: "20:00",
          endTime: "22:00",
        },
      ],
    },
    {
      id: 2,
      tierName: "Bậc 2 (Giờ cao điểm)",
      unitPrice: 3150,
      timeSlots: [
        {
          startTime: "09:30",
          endTime: "11:30",
        },
        {
          startTime: "17:00",
          endTime: "20:00",
        },
      ],
    },
    {
      id: 3,
      tierName: "Bậc 3 (Giờ thấp điểm)",
      unitPrice: 1161,
      timeSlots: [
        {
          startTime: "22:00",
          endTime: "04:00",
        },
      ],
    },
  ]);

  const mockSubmit = (reactNode) => {
    // const titleElement = document.querySelector(".DAT_SystemSetting_Title");
    // if (!titleElement) return;

    // const alertDiv = document.createElement("div");
    // alertDiv.className = "DAT_SystemSetting_Messages";

    // titleElement.parentNode.insertBefore(alertDiv, titleElement.nextSibling);

    // const root = createRoot(alertDiv);
    // root.render(reactNode);

    // setTimeout(() => {
    //   root.unmount();
    //   alertDiv.remove();
    // }, 3000);
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: lang.formatMessage({
        id: "system_setting_electricity_price_tier_save_success",
      }),
    });
  };

  const handleDeleteTier = () => {
    setElectricityPriceTiers((prevTiers) => {
      return prevTiers.filter((_, i) => i !== currentTierIndexToDelete);
    });
    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: lang.formatMessage({
        id: "system_setting_electricity_price_tier_delete_confirm_alert_success",
      }),
    });
    setTierDeleteConfirmDialogVisible(false);
  };

  const handleDeleteTimeSlot = () => {
    if (!currentTimeSlotToDelete) return;

    const targetTierIndex = currentTimeSlotToDelete.tierIndex;
    const targetSlotIndex = currentTimeSlotToDelete.slotIndex;

    setElectricityPriceTiers((prevTiers) => {
      return prevTiers.map((tier, i) => {
        if (i === targetTierIndex) {
          return {
            ...tier,
            timeSlots: tier.timeSlots.filter(
              (_, index) => index !== targetSlotIndex,
            ),
          };
        }
        return tier;
      });
    });

    toastRef.current.show({
      severity: "success",
      summary: "Success",
      detail: lang.formatMessage({
        id: "system_setting_electricity_price_tier_time_delete_confirm_alert_success",
      }),
    });

    setTimeSlotDeleteConfirmDialogVisible(false);
    setCurrentTimeSlotToDelete(null);
  };

  const handleTimeSlotChange = (tierIndex, slotIndex, field, value) => {
    setElectricityPriceTiers((prevTiers) => {
      // Deep clone the necessary parts to avoid mutation
      const newTiers = [...prevTiers];
      const newTier = { ...newTiers[tierIndex] };
      const newTimeSlots = [...newTier.timeSlots];

      newTimeSlots[slotIndex] = {
        ...newTimeSlots[slotIndex],
        [field]: value,
      };

      newTier.timeSlots = newTimeSlots;
      newTiers[tierIndex] = newTier;

      return newTiers;
    });
  };

  return (
    <div className="DAT_SystemSetting">
      <Toast
        ref={toastRef}
        position="top-right"
        className={`DAT_SystemSetting_Toast`}
      />
      <ConfirmDialog
        group="declarative"
        visible={tierDeleteConfirmDialogVisible}
        maskStyle={{
          background: "rgba(0,0,0,0.5)",
          WebkitBackdropFilter: "blur(5px)",
          backdropFilter: "blur(5px)",
        }}
        onHide={() => {
          setCurrentTierIndexToDelete(null);
          setTierDeleteConfirmDialogVisible(false);
        }}
        message={lang.formatMessage({
          id: "system_setting_electricity_price_tier_delete_confirm",
        })}
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={handleDeleteTier}
        reject={() => {
          setCurrentTierIndexToDelete(null);
          setTierDeleteConfirmDialogVisible(false);
        }}
        className={`DAT_SystemSetting_ConfirmDialog`}
      />

      <ConfirmDialog
        group="declarative"
        visible={timeSlotDeleteConfirmDialogVisible}
        maskStyle={{
          background: "rgba(0,0,0,0.5)",
          WebkitBackdropFilter: "blur(5px)",
          backdropFilter: "blur(5px)",
        }}
        onHide={() => {
          setCurrentTimeSlotToDelete(null);
          setTimeSlotDeleteConfirmDialogVisible(false);
        }}
        message={lang.formatMessage({
          id: "system_setting_electricity_price_tier_time_delete_confirm",
        })}
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={handleDeleteTimeSlot}
        reject={() => {
          setCurrentTimeSlotToDelete(null);
          setTimeSlotDeleteConfirmDialogVisible(false);
        }}
        className={`DAT_SystemSetting_ConfirmDialog`}
      />

      <div className={`DAT_SystemSetting_Header`}>
        <button
          className="DAT_SystemSetting_Header_BackBtn"
          onClick={() => navigate("/dashboard")}
        >
          <LuChevronLeft />
        </button>
        <div className="DAT_SystemSetting_Header_Title">
          {lang.formatMessage({ id: "system_setting_title" })}
        </div>
      </div>
      <div className={`DAT_NavyCard DAT_SystemSetting_CO2EConvert`}>
        <div className={`DAT_SystemSetting_CO2EConvert_Head`}>
          <div className={`DAT_SystemSetting_CO2EConvert_Head_Left`}>
            <div className={`DAT_SystemSetting_CO2EConvert_Head_Left_Title`}>
              {lang.formatMessage({ id: "system_setting_co2e_convert_title" })}
            </div>
            <div
              className={`DAT_SystemSetting_CO2EConvert_Head_Left_Description`}
            >
              {lang.formatMessage({
                id: "system_setting_co2e_convert_description",
              })}
            </div>
          </div>
          <div className={`DAT_SystemSetting_CO2EConvert_Head_Right`}>
            {lang.formatMessage({ id: "system_setting_co2e_convert_factors" })}
          </div>
        </div>
        <div className={`DAT_SystemSetting_CO2EConvert_Body`}>
          <div className={`DAT_SystemSetting_CO2EConvert_Body_Item`}>
            <div className={`DAT_SystemSetting_CO2EConvert_Body_Item_Title`}>
              {lang.formatMessage({
                id: "system_setting_co2e_convert_electricity",
              })}
            </div>
            <div
              className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField`}
            >
              <input
                type="number"
                step="0.0001"
                min="0"
                value={co2eConvertFactors.electricity}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setCo2eConvertFactors((prev) => ({
                      ...prev,
                      electricity: newValue,
                    }));
                  }
                }}
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Input`}
              />
              <div
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Units`}
              >
                kgCO₂e/kWh
              </div>
            </div>
          </div>
          <div className={`DAT_SystemSetting_CO2EConvert_Body_Item`}>
            <div className={`DAT_SystemSetting_CO2EConvert_Body_Item_Title`}>
              {lang.formatMessage({ id: "system_setting_co2e_convert_water" })}
            </div>
            <div
              className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField`}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                value={co2eConvertFactors.water}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setCo2eConvertFactors((prev) => ({
                      ...prev,
                      water: newValue,
                    }));
                  }
                }}
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Input`}
              />
              <div
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Units`}
              >
                kgCO₂e/m³
              </div>
            </div>
          </div>
          <div className={`DAT_SystemSetting_CO2EConvert_Body_Item`}>
            <div className={`DAT_SystemSetting_CO2EConvert_Body_Item_Title`}>
              {lang.formatMessage({ id: "system_setting_co2e_convert_air" })}
            </div>
            <div
              className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField`}
            >
              <input
                type="number"
                step="0.1"
                min="0"
                value={co2eConvertFactors.air}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  if (!isNaN(newValue)) {
                    setCo2eConvertFactors((prev) => ({
                      ...prev,
                      air: newValue,
                    }));
                  }
                }}
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Input`}
              />
              <div
                className={`DAT_SystemSetting_CO2EConvert_Body_Item_InputField_Units`}
              >
                kgCO₂e/Nm³
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`DAT_NavyCard DAT_SystemSetting_ElectricityPriceSetting`}>
        <div className={`DAT_SystemSetting_ElectricityPriceSetting_Head`}>
          <div
            className={`DAT_SystemSetting_ElectricityPriceSetting_Head_Left`}
          >
            <div
              className={`DAT_SystemSetting_ElectricityPriceSetting_Head_Left_Title`}
            >
              {lang.formatMessage({
                id: "system_setting_electricity_price_title",
              })}
            </div>
            <div
              className={`DAT_SystemSetting_ElectricityPriceSetting_Head_Left_Description`}
            >
              {lang.formatMessage({
                id: "system_setting_electricity_price_description",
              })}
            </div>
          </div>
          <button
            className={`DAT_SystemSetting_ElectricityPriceSetting_Head_Right`}
            onClick={() => {
              setElectricityPriceTiers((prevTiers) => [
                ...prevTiers,
                {
                  id: prevTiers.length + 1,
                  tierName: `Bậc ${prevTiers.length + 1}`,
                  unitPrice: 0,
                  timeSlots: [{ startTime: "00:00", endTime: "00:00" }],
                },
              ]);
              toastRef.current.show({
                severity: "success",
                summary: "Success",
                detail: lang.formatMessage({
                  id: "system_setting_electricity_price_add_tier_success",
                }),
              });
            }}
          >
            {lang.formatMessage({
              id: "system_setting_electricity_price_add_tier",
            })}
          </button>
        </div>
        <div className={`DAT_SystemSetting_ElectricityPriceSetting_Body`}>
          {electricityPriceTiers.map((tier, index) => (
            <div
              className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item`}
            >
              <div
                className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_NameCol`}
              >
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_Title DAT_SystemSetting_ElectricityPriceSetting_Body_Item_NameCol_Title`}
                >
                  {lang.formatMessage({
                    id: "system_setting_electricity_price_tier_title",
                  })}{" "}
                  ({index + 1})
                </div>
                <input
                  type="text"
                  value={tier.tierName}
                  onChange={(e) => {
                    const newPrice = e.target.value;
                    setElectricityPriceTiers((prevTiers) => {
                      const updatedTiers = [...prevTiers];
                      updatedTiers[index] = {
                        ...updatedTiers[index],
                        tierName: newPrice,
                      };
                      return updatedTiers;
                    });
                  }}
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_NameCol_Input`}
                />
              </div>
              <div
                className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_UnitPriceCol`}
              >
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_Title DAT_SystemSetting_ElectricityPriceSetting_Body_Item_UnitPriceCol_Title`}
                >
                  {lang.formatMessage({
                    id: "system_setting_electricity_price_tier_price",
                  })}
                </div>
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_UnitPriceCol_InputField_Row`}
                >
                  <input
                    type="number"
                    value={tier.unitPrice}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setElectricityPriceTiers((prevTiers) => {
                        const updatedTiers = [...prevTiers];
                        updatedTiers[index] = {
                          ...updatedTiers[index],
                          unitPrice: newPrice,
                        };
                        return updatedTiers;
                      });
                    }}
                    className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_UnitPriceCol_InputField_Row_Input`}
                  />
                  <div
                    className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_UnitPriceCol_InputField_Row_Units`}
                  >
                    VNĐ
                  </div>
                </div>
              </div>
              <div
                className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol`}
              >
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Head`}
                >
                  <div
                    className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_Title DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Head_Title`}
                  >
                    {lang.formatMessage({
                      id: "system_setting_electricity_price_tier_time",
                    })}
                  </div>
                  <button
                    className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Head_AddTimeSlotBtn`}
                    onClick={() => {
                      setElectricityPriceTiers((prevTiers) => {
                        return prevTiers.map((tier, i) => {
                          if (i === index) {
                            return {
                              ...tier,
                              timeSlots: [
                                ...tier.timeSlots,
                                { startTime: "00:00", endTime: "00:00" },
                              ],
                            };
                          }
                          return tier;
                        });
                      });
                      toastRef.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: lang.formatMessage({
                          id: "system_setting_electricity_price_tier_time_add_success",
                        }),
                      });
                    }}
                  >
                    <FiPlus />
                    {lang.formatMessage({
                      id: "system_setting_electricity_price_tier_time_add",
                    })}
                  </button>
                </div>
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body`}
                >
                  {tier.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex} // FIXED: Don't use changing values in the key
                      className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body_Row`}
                    >
                      <input
                        type="text"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleTimeSlotChange(
                            index,
                            slotIndex,
                            "startTime",
                            e.target.value,
                          )
                        } // Cleaner handler
                        className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body_Row_Input`}
                      />
                      <span
                        className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body_Row_Separator`}
                      >
                        -
                      </span>
                      <input
                        type="text"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleTimeSlotChange(
                            index,
                            slotIndex,
                            "endTime",
                            e.target.value,
                          )
                        } // Cleaner handler
                        className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body_Row_Input`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTimeSlotToDelete({
                            tierIndex: index,
                            slotIndex,
                          });
                          setTimeSlotDeleteConfirmDialogVisible(true);
                        }}
                        title={lang.formatMessage({
                          id: "system_setting_electricity_price_tier_time_delete",
                        })}
                        className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_TimeCol_Body_Row_DeleteBtn`}
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_ActionCol`}
              >
                <div
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_Title`}
                ></div>
                <button
                  type="button"
                  className={`DAT_SystemSetting_ElectricityPriceSetting_Body_Item_ActionCol_DeleteBtn`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTierIndexToDelete(index);
                    setTierDeleteConfirmDialogVisible(true);
                  }}
                  title={lang.formatMessage({
                    id: "system_setting_electricity_price_tier_delete",
                  })}
                >
                  <IoMdClose />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`DAT_SystemSetting_ActionRow`}>
        <button
          className={`DAT_SystemSetting_ActionRow_SaveBtn`}
          onClick={() => {
            mockSubmit();
          }}
        >
          {lang.formatMessage({
            id: "system_setting_electricity_price_tier_save",
          })}
        </button>
      </div>
    </div>
  );
};

export default SystemSetting;
