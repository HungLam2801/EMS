import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Role.scss";
import "./RoleMobile.scss";
import { useIntl } from "react-intl";
import { LuSettings, LuEye } from "react-icons/lu";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
// API tạm thời comment để chạy bằng mock data.
// import { callApi } from "../../Api/Api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isMobile } from "react-device-detect";
import { SystemContext } from "../../contexts/SystemContext.js";
import Modal from "../../Modal/Modal";
// Nếu Data.js của bạn nằm ở chỗ khác thì chỉ cần sửa lại path import này.
import { roleMockData } from "../../Data/Data";

const defaultPermissions = {
  read: "read",
  update: "update",
  create: "create",
  delete: "delete",
};

const PAGE_SIZE = 5;

const formatRoleId = (id) => `ROLE-${String(id).padStart(3, "0")}`;

const parseDate = (value) => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

export default function Role() {
  const lang = useIntl();
  const { permissions } = useContext(SystemContext);
  const navigate = useNavigate();

  const [roles, setRoles] = useState(roleMockData);
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("active");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id");
  const [filterStatus, setFilterStatus] = useState("");

  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalType, setModalType] = useState(null);

  const rolePermissions = permissions?.roles ?? [];

  const hasPermission = (permission) => rolePermissions.includes(permission);

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let result = roles.filter((item) => {
      const matchSearch =
        !keyword ||
        item.roleName.toLowerCase().includes(keyword) ||
        item.createdBy.toLowerCase().includes(keyword) ||
        formatRoleId(item.id).toLowerCase().includes(keyword);

      const matchStatus = !filterStatus || item.status === filterStatus;

      return matchSearch && matchStatus;
    });

    result = [...result].sort((a, b) => {
      if (sort === "asc") {
        return parseDate(a.createdAt) - parseDate(b.createdAt);
      }

      if (sort === "desc") {
        return parseDate(b.createdAt) - parseDate(a.createdAt);
      }

      return a.id - b.id;
    });

    return result;
  }, [roles, search, filterStatus, sort]);

  const totalPage = Math.max(1, Math.ceil(filteredRoles.length / PAGE_SIZE));

  const currentRoles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRoles.slice(start, start + PAGE_SIZE);
  }, [filteredRoles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, sort]);

  useEffect(() => {
    if (currentPage > totalPage) {
      setCurrentPage(totalPage);
    }
  }, [currentPage, totalPage]);

  const roleInfo = [
    {
      label: lang.formatMessage({ id: "role_id_table" }),
      value: selectedRole ? formatRoleId(selectedRole.id) : "-",
    },
    {
      label: lang.formatMessage({ id: "role_name_table" }),
      value: selectedRole?.roleName,
    },
    {
      label: lang.formatMessage({ id: "role_status_tabel" }),
      value:
        selectedRole?.status === "active"
          ? lang.formatMessage({ id: "statusActive_role" })
          : lang.formatMessage({ id: "statusInactive_role" }),
    },
    {
      label: lang.formatMessage({ id: "role_create_at_table" }),
      value: selectedRole?.createdAt,
    },
    {
      label: lang.formatMessage({ id: "role_create_by_table" }),
      value: selectedRole?.createdBy,
    },
    {
      label: lang.formatMessage({ id: "number_of_user" }),
      value: selectedRole
        ? `${selectedRole.numberOfUser} ${lang.formatMessage({
            id: "users",
          })}`
        : "-",
    },
  ];

  const handleCreateRole = () => {
    const trimmedRoleName = roleName.trim();

    if (!trimmedRoleName) {
      return;
    }

    const isExisted = roles.some(
      (item) => item.roleName.toLowerCase() === trimmedRoleName.toLowerCase(),
    );

    if (isExisted) {
      toast.error(lang.formatMessage({ id: "toast_existed_role" }));
      return;
    }

    const nextId =
      roles.length > 0 ? Math.max(...roles.map((item) => item.id)) + 1 : 1;

    const today = new Date();
    const createdAt = [
      String(today.getDate()).padStart(2, "0"),
      String(today.getMonth() + 1).padStart(2, "0"),
      today.getFullYear(),
    ].join("/");

    const newRole = {
      id: nextId,
      roleName: trimmedRoleName,
      status,
      createdAt,
      createdBy: "Admin",
      numberOfUser: 0,
    };

    setRoles((prev) => [newRole, ...prev]);
    setRoleName("");
    setStatus("active");
    setModalType(null);

    toast.success(lang.formatMessage({ id: "toast_created" }));

    /*
    // =========================
    // API CREATE ROLE - TẠM COMMENT
    // =========================
    try {
      const response = await callApi(
        "post",
        `${process.env.REACT_APP_API}/data/createRole`,
        {
          roleName,
          status,
        }
      );

      if (response.status === false) {
        toast.error(
          lang.formatMessage({ id: "toast_existed_role" })
        );
        console.log(response.msg);
      } else {
        toast.success(
          lang.formatMessage({ id: "toast_created" })
        );
        setModalType(null);
      }
    } catch (error) {
      console.log(error);
    }
    */
  };

  /*
  // =========================
  // API GET ALL ROLE - TẠM COMMENT
  // =========================
  const getAllRole = async (current, search, filterStatus) => {
    try {
      const response = await callApi(
        "get",
        `${process.env.REACT_APP_API}/data/getAllRoles?search=${search}&status=${filterStatus}&sort=${sort}&page=${current}`
      );

      if (response.status === false) {
        console.log(response.msg);
      } else {
        setRoles(response.data);
        setTotalPage(response.totalPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRole(currentPage, search, filterStatus);
  }, [currentPage, search, filterStatus, sort, modalType]);
  */

  const handleDelete = () => {
    setRoles((prev) => prev.filter((item) => item.id !== deleteRoleId));

    if (selectedRole?.id === deleteRoleId) {
      setSelectedRole(null);
    }

    setDeleteRoleId(null);
    setModalType(null);

    toast.success(lang.formatMessage({ id: "toast_deleted" }));

    /*
    // =========================
    // API DELETE ROLE - TẠM COMMENT
    // =========================
    try {
      const res = await callApi(
        "post",
        `${process.env.REACT_APP_API}/data/deleteRole`,
        {
          roleId: deleteRoleId,
        }
      );

      if (res.status) {
        toast.success(
          lang.formatMessage({ id: "toast_deleted" })
        );

        getAllRole(currentPage, search, filterStatus);
        setModalType(null);
      } else {
        toast.error(
          lang.formatMessage({ id: "toast_error" })
        );
      }
    } catch (error) {
      console.log(error);
      alert("Có lỗi xảy ra khi xóa!");
    }
    */
  };

  const renderTitle = () => {
    switch (modalType) {
      case "add":
        return lang.formatMessage({
          id: "role_modal_create_title",
        });

      case "view":
        return lang.formatMessage({
          id: "role_modal_view_title",
        });

      case "delete":
        return lang.formatMessage({
          id: "confirm_delete",
        });

      default:
        return "";
    }
  };

  const renderModalAddRole = () => (
    <div className="DAT_RoleSetting_Form_Grid">
      <div className="DAT_RoleSetting_Form_Grid_Group">
        <label className="DAT_RoleSetting_Form_Grid_Group_Label">
          {lang.formatMessage({
            id: "role_modal_full_name",
          })}
        </label>

        <input
          className="DAT_RoleSetting_Form_Grid_Group_Input"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>

      <div className="DAT_RoleSetting_Form_Grid_Group">
        <label className="DAT_RoleSetting_Form_Grid_Group_Label">
          {lang.formatMessage({
            id: "role_modal_status",
          })}
        </label>

        <select
          className="DAT_RoleSetting_Form_Grid_Group_Select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="active">
            {lang.formatMessage({
              id: "statusActive_role",
            })}
          </option>

          <option value="inactive">
            {lang.formatMessage({
              id: "statusInactive_role",
            })}
          </option>
        </select>
      </div>
    </div>
  );

  const renderModalViewRole = () => (
    <div className="DAT_RoleSettingMobile_Modal">
      {roleInfo.map((item) => (
        <div key={item.label} className="DAT_RoleSettingMobile_Modal_Row">
          <div className="DAT_RoleSettingMobile_Modal_Row_Label">
            {item.label}
          </div>

          <div className="DAT_RoleSettingMobile_Modal_Row_Value">
            {item.value || "-"}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBody = () => {
    switch (modalType) {
      case "add":
        return renderModalAddRole();

      case "view":
        return renderModalViewRole();

      case "delete":
        return lang.formatMessage({
          id: "description_delete_role",
        });

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (modalType) {
      case "add":
        return (
          <>
            <button
              className="DAT_RoleSetting_Modal_Footer_Button_Secondary"
              onClick={() => setModalType(null)}
            >
              {lang.formatMessage({ id: "modal_cancel" })}
            </button>

            <button
              className="DAT_RoleSetting_Modal_Footer_Button_Primary"
              onClick={handleCreateRole}
            >
              {lang.formatMessage({
                id: "role_modal_save",
              })}
            </button>
          </>
        );

      case "view":
        return (
          <div className="DAT_RoleSettingMobile_Modal_Foot">
            {hasPermission(defaultPermissions.update) && (
              <button
                className="DAT_RoleSettingMobile_Modal_Foot_Button_GhostSm"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--primary-light)",
                }}
                onClick={() => navigate(`/roles/${selectedRole?.id}`)}
              >
                {lang.formatMessage({
                  id: "user_edit_button",
                })}
              </button>
            )}

            {hasPermission(defaultPermissions.delete) && (
              <div
                className="DAT_RoleSettingMobile_Modal_Foot_Btn_Delete"
                onClick={() => {
                  setDeleteRoleId(selectedRole?.id);
                  setModalType("delete");
                }}
              >
                {lang.formatMessage({
                  id: "user_delete_button",
                })}
              </div>
            )}
          </div>
        );

      case "delete":
        return (
          <>
            <button
              className="DAT_RoleSetting_Modal_Container_Foot_Btn_Cancel"
              onClick={() => setModalType(null)}
            >
              {lang.formatMessage({ id: "cancel" })}
            </button>

            <button
              className="DAT_RoleSetting_Modal_Container_Foot_Btn_Delete"
              onClick={handleDelete}
            >
              {lang.formatMessage({
                id: "user_delete_button",
              })}
            </button>
          </>
        );

      default:
        return null;
    }
  };

  const renderMobile = () => (
    <div className="DAT_RoleSettingMobile">
      <div className="DAT_RoleSettingMobile_Card">
        <div className="DAT_RoleSettingMobile_Card_Info">
          <div className="DAT_RoleSettingMobile_Card_Info_Icon">
            <LuSettings size={25} />
          </div>

          <div className="DAT_RoleSettingMobile_Card_Info_Title">
            {lang.formatMessage({
              id: "role_management",
            })}
          </div>
        </div>

        <div className="DAT_RoleSettingMobile_Card_Actions">
          <input
            className="DAT_RoleSettingMobile_Card_Actions_FilterInput"
            style={{ width: 220 }}
            placeholder={lang.formatMessage({
              id: "role_search",
            })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {hasPermission(defaultPermissions.create) && (
            <button
              className="DAT_RoleSettingMobile_Card_Actions_Button_Primary"
              onClick={() => setModalType("add")}
            >
              <AiOutlineUsergroupAdd size={22} />
            </button>
          )}

          <select
            className="DAT_RoleSettingMobile_Card_Actions_FilterSelect"
            style={{ width: 140 }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">{lang.formatMessage({ id: "all_role" })}</option>
            <option value="active">
              {lang.formatMessage({
                id: "statusActive_role",
              })}
            </option>
            <option value="inactive">
              {lang.formatMessage({
                id: "statusInactive_role",
              })}
            </option>
          </select>

          <select
            className="DAT_RoleSettingMobile_Card_Actions_FilterSelect"
            style={{ width: 100 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
            <option value="asc">
              {lang.formatMessage({ id: "sort_asc" })}
            </option>
            <option value="desc">
              {lang.formatMessage({ id: "sort_desc" })}
            </option>
          </select>
        </div>
      </div>

      <div className="DAT_RoleSettingMobile_Container">
        {currentRoles.map((item) => (
          <div key={item.id} className="DAT_RoleSettingMobile_Container_Card">
            <div className="DAT_RoleSettingMobile_Container_Card_Left">
              <div className="DAT_RoleSettingMobile_Container_Card_Left_Label">
                {formatRoleId(item.id)}
              </div>

              <div className="DAT_RoleSettingMobile_Container_Card_Left_Item">
                <div className="DAT_RoleSettingMobile_Container_Card_Left_Item_Title">
                  {item.roleName}
                </div>

                <div className="DAT_RoleSettingMobile_Container_Card_Left_Item_Subtitle">
                  {item.numberOfUser} {lang.formatMessage({ id: "users" })}
                </div>
              </div>
            </div>

            <div className="DAT_RoleSettingMobile_Container_Card_Right">
              <div className="DAT_RoleSettingMobile_Container_Card_Right_Item">
                <div className="DAT_RoleSettingMobile_Container_Card_Right_Item_Date">
                  {item.createdAt}
                </div>

                <div
                  className="DAT_RoleSettingMobile_Container_Card_Right_Item_Status"
                  style={{
                    color: item.status === "active" ? "green" : "red",
                  }}
                >
                  {item.status === "active"
                    ? lang.formatMessage({
                        id: "statusActive_role",
                      })
                    : lang.formatMessage({
                        id: "statusInactive_role",
                      })}
                </div>
              </div>

              <button
                className="DAT_RoleSettingMobile_Container_Card_Right_Button"
                aria-label="View role detail"
                onClick={() => {
                  setSelectedRole(item);
                  setModalType("view");
                }}
              >
                <LuEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}
      {renderModal()}
    </div>
  );

  const renderDesktop = () => (
    <div className="DAT_RoleSetting">
      <div className="DAT_RoleSetting_HeaderCard">
        <div className="DAT_RoleSetting_HeaderCard_Main">
          <div className="DAT_RoleSetting_HeaderCard_Main_Icon">
            <LuSettings size={25} />
          </div>

          <div className="DAT_RoleSetting_HeaderCard_Main_Title">
            {lang.formatMessage({
              id: "role_management",
            })}
          </div>
        </div>

        <div className="DAT_RoleSetting_Card_Actions">
          <input
            className="DAT_RoleSetting_Card_Actions_FilterInput"
            style={{ width: 220 }}
            placeholder={lang.formatMessage({
              id: "role_search",
            })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="DAT_RoleSetting_Card_Actions_FilterSelect"
            style={{ width: 140 }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">{lang.formatMessage({ id: "all_role" })}</option>
            <option value="active">
              {lang.formatMessage({
                id: "statusActive_role",
              })}
            </option>
            <option value="inactive">
              {lang.formatMessage({
                id: "statusInactive_role",
              })}
            </option>
          </select>

          <select
            className="DAT_RoleSetting_Card_Actions_FilterSelect"
            style={{ width: 100 }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
            <option value="asc">
              {lang.formatMessage({ id: "sort_asc" })}
            </option>
            <option value="desc">
              {lang.formatMessage({ id: "sort_desc" })}
            </option>
          </select>

          {hasPermission(defaultPermissions.create) && (
            <button
              className="DAT_RoleSetting_Card_Actions_Button_Primary"
              onClick={() => setModalType("add")}
            >
              {lang.formatMessage({ id: "add_role" })}
            </button>
          )}
        </div>
      </div>

      <div className="DAT_RoleSetting_Container">
        <div className="DAT_RoleSetting_Container_Table">
          <table className="DAT_RoleSetting_Container_Table_Main">
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>
                  {lang.formatMessage({
                    id: "role_id_table",
                  })}
                </th>
                <th>
                  {lang.formatMessage({
                    id: "role_name_table",
                  })}
                </th>
                <th>
                  {lang.formatMessage({
                    id: "role_status_tabel",
                  })}
                </th>
                <th>
                  {lang.formatMessage({
                    id: "role_create_at_table",
                  })}
                </th>
                <th>
                  {lang.formatMessage({
                    id: "role_create_by_table",
                  })}
                </th>
                <th>
                  {lang.formatMessage({
                    id: "number_of_user",
                  })}
                </th>

                {(hasPermission(defaultPermissions.update) ||
                  hasPermission(defaultPermissions.delete)) && (
                  <th>
                    {lang.formatMessage({
                      id: "role_action_table",
                    })}
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="DAT_RoleSetting_Container_Table_Main_Body">
              {currentRoles.map((item) => (
                <tr
                  className="DAT_RoleSetting_Container_Table_Main_Row"
                  key={item.id}
                >
                  <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                    {formatRoleId(item.id)}
                  </td>

                  <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                    {item.roleName}
                  </td>

                  <td
                    className={`DAT_RoleSetting_Container_Table_Main_Cell--${item.status}`}
                  >
                    {item.status === "active"
                      ? lang.formatMessage({
                          id: "statusActive_role",
                        })
                      : lang.formatMessage({
                          id: "statusInactive_role",
                        })}
                  </td>

                  <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                    {item.createdAt}
                  </td>

                  <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                    {item.createdBy}
                  </td>

                  <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                    {item.numberOfUser} {lang.formatMessage({ id: "users" })}
                  </td>

                  {(hasPermission(defaultPermissions.update) ||
                    hasPermission(defaultPermissions.delete)) && (
                    <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                      <div className="DAT_RoleSetting_Container_Table_Main_Cell_Action">
                        {hasPermission(defaultPermissions.update) && (
                          <button
                            className="DAT_RoleSetting_Container_Table_Main_Cell_Action_Button"
                            onClick={() => navigate(`/roles/${item.id}`)}
                          >
                            {lang.formatMessage({
                              id: "role_edit_button",
                            })}
                          </button>
                        )}

                        {hasPermission(defaultPermissions.delete) && (
                          <button
                            className="DAT_RoleSetting_Container_Table_Main_Cell_Action_Button"
                            onClick={() => {
                              setDeleteRoleId(item.id);
                              setModalType("delete");
                            }}
                          >
                            {lang.formatMessage({
                              id: "role_delete_button",
                            })}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {renderPagination()}
      </div>

      {renderModal()}
    </div>
  );

  function renderPagination() {
    if (totalPage <= 1) {
      return null;
    }

    return (
      <div className="DAT_RoleSetting_Container_Pagination">
        <button
          className="DAT_RoleSetting_Container_Pagination_Btn DAT_RoleSetting_Container_Pagination_Btn--prev"
          onClick={() =>
            setCurrentPage((prev) => (prev === 1 ? totalPage : prev - 1))
          }
        >
          &lt;
        </button>

        {Array.from({ length: totalPage }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              className={`DAT_RoleSetting_Container_Pagination_Btn${
                page === currentPage
                  ? " DAT_RoleSetting_Container_Pagination_Btn--active"
                  : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ),
        )}

        <button
          className="DAT_RoleSetting_Container_Pagination_Btn DAT_RoleSetting_Container_Pagination_Btn--next"
          onClick={() =>
            setCurrentPage((prev) => (prev === totalPage ? 1 : prev + 1))
          }
        >
          &gt;
        </button>
      </div>
    );
  }

  function renderModal() {
    return (
      <Modal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        title={renderTitle()}
        footer={renderFooter()}
      >
        {renderBody()}
      </Modal>
    );
  }

  return isMobile ? renderMobile() : renderDesktop();
}
