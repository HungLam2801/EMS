import React, { useMemo, useState, useEffect, useRef, useContext } from "react";

import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import "./UserManagement.scss";
import "./UserManagementMobile.scss";

import { useIntl } from "react-intl";
import { LuUsers, LuUserPlus, LuMenu, LuUser } from "react-icons/lu";
// import { callApi, From } from "../../Api/Api"; // [MOCKED] API call bị comment lại, dùng mock data thay thế
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SystemContext } from "../../contexts/SystemContext";
import {
  mockGetAllRoles,
  mockUpdateUser,
  mockCreateUser,
  mockDeleteUser,
  mockGetAllUser,
  mockRenderOtp,
} from "../../Data/Data";
/* ==========================================================================
 * [MOCK DATA] - Toàn bộ dữ liệu & hàm bên dưới dùng để thay thế cho các API thật:
 *   - POST /data/getAllUser                 -> mockGetAllUser()
 *   - POST /data/updateUser                 -> mockUpdateUser()
 *   - POST /data/deleteUser                 -> mockDeleteUser()
 *   - POST /data/renderOtpWhenCreateUser    -> mockRenderOtp()
 *   - POST /data/createUser                 -> mockCreateUser()
 *   - GET  /data/getAllRoles                -> mockGetAllRoles()
 * "Database" mock được lưu trong biến MOCK_USERS_DB (module scope) để các
 * thao tác thêm/sửa/xoá vẫn phản ánh được lên danh sách trong phiên làm việc.
 * OTP mock cố định là "123456" để tiện test luồng tạo user.
 * Khi tích hợp API thật, chỉ cần bỏ comment lại import callApi/From và các
 * đoạn callApi tương ứng, đồng thời xoá/bỏ qua phần mock bên dưới.
 * ========================================================================== */

const emptyUser = {
  id: "",
  name: "",
  userName: "",
  email: "",
  password: "",
  role: 1,
  status: "active",
};

const defaultPermissions = {
  read: 'read',
  update: "update",
  create: "create",
  delete: "delete",
  recovery: "recovery",
}
export default function UserManagement() {
  // [MOCKED] Giá trị mặc định phòng khi component được render mà chưa có
  // <SystemContext.Provider> bọc ngoài (ví dụ khi xem preview độc lập) -
  // tránh lỗi "Cannot read properties of undefined (reading 'includes')".
  // Khi chạy trong app thật có Provider cung cấp đủ userId/permissions,
  // giá trị mock này sẽ không được dùng tới.
  const MOCK_SYSTEM_CONTEXT = {
    userId: 1,
    permissions: {
      users: ["read", "update", "create", "delete", "recovery"],
    },
  };

  const systemContextValue = useContext(SystemContext) || MOCK_SYSTEM_CONTEXT;
  const userId = systemContextValue.userId ?? MOCK_SYSTEM_CONTEXT.userId;
  const permissions = systemContextValue.permissions ?? MOCK_SYSTEM_CONTEXT.permissions;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [roleUser, setRoleUser] = useState(1);
  const [statusUser, setStatusUser] = useState("active");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [roles, setRoles] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState();
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const userRef = useRef(null);
  const lang = useIntl();

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const normalizeValue = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const loadUser = async () => {
    // [MOCKED] API thật bị comment lại, dùng mockGetAllUser thay thế
    // let res = await callApi(
    //   "post",
    //   `${process.env.REACT_APP_API}/data/getAllUser`,
    //   {},
    // );
    let res = await mockGetAllUser();
    if (res.status === true) {
      const list = res.data.map((item) => ({
        id: item.id_,
        name: item.full_name_,
        userName: item.username_,
        email: item.email_,
        roleId: item.roleid_,
        roleName: item.rolename_,
        status: normalizeValue(item.status_),
        created: item.created_at_,
      }));

      setUsers(list);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    loadUser(role);
  }, [addUser, role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const userInfo = [
    {
      label: lang.formatMessage({ id: "user_name_table" }),
      value: selectedUser?.name,
    },
    { label: "Email", value: selectedUser?.email },
    {
      label: lang.formatMessage({ id: "user_role_table" }),
      value: selectedUser?.roleName,
    },
    {
      label: lang.formatMessage({ id: "user_status_table" }),
      value: selectedUser?.status,
    },
    {
      label: lang.formatMessage({ id: "user_create_at_table" }),
      value: selectedUser?.created
        ? new Date(selectedUser?.created).toLocaleString("vi-VN")
        : "-",
    },
  ];

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (role !== "All" && normalizeValue(user.roleId) !== normalizeValue(role)) {
          return false;
        }
        if (status !== "All" && normalizeValue(user.status) !== normalizeValue(status)) {
          return false;
        }
        if (search) {
          const keyword = search.toLowerCase();
          return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            String(user.userName).toLowerCase().includes(keyword)
          );
        }
        return true;
      }),
    [role, status, search, users],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      password: "",
      role: user.roleId,
      status: user.status,
    });
    setModalType("edit");
  };

  const saveUser = async () => {
    try {
      const payload = {
        userId: form.id,
        fullName: form.name,
        roleId: Number(form.role),
        status: form.status,
      };

      if (form.password.trim() !== "") {
        payload.password = form.password;
      }

      // [MOCKED] API thật bị comment lại, dùng mockUpdateUser thay thế
      // const response = await callApi(
      //   "post",
      //   `${process.env.REACT_APP_API}/data/updateUser`,
      //   payload
      // );
      const response = await mockUpdateUser(payload);

      if (response.status === true) {
        toast.success(lang.formatMessage({ id: "toast_updated" }))
        setModalType(null);
        setEditing(null);
        setForm(emptyUser);
        loadUser();
      } else {
        toast.error(lang.formatMessage({ id: "toast_error" }), {
          description: response.msg
        })
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      alert("Đã xảy ra lỗi hệ thống khi cập nhật!");
    }
  };

  const handleAction = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === "active" ? "locked" : "active";
      // [MOCKED] API thật bị comment lại, dùng mockUpdateUser thay thế
      // const res = await callApi(
      //   "post",
      //   process.env.REACT_APP_API + "/data/updateUser",
      //   {
      //     action: "updateStatus",
      //     id: id,
      //     status: nextStatus,
      //   }
      // );
      const res = await mockUpdateUser({
        action: "updateStatus",
        id: id,
        status: nextStatus,
      });

      if (res.status) {
        loadUser();
        setIsModalOpen(false);
      } else {
        console.log("error database");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      // [MOCKED] API thật bị comment lại, dùng mockDeleteUser thay thế
      // const res = await callApi(
      //   "post",
      //   `${process.env.REACT_APP_API}/data/deleteUser`,
      //   {
      //     userId: deleteUserId,
      //   }
      // );
      const res = await mockDeleteUser(deleteUserId);

      if (res.status) {
        toast.success(lang.formatMessage({ id: "toast_deleted" }))
        loadUser();
        setModalType(null); // Đóng modal sau khi xóa thành công
      } else {
        toast.error(lang.formatMessage({ id: "toast_error" }))
        console.log(res.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError("");
    const fullName = e.target.fullname.value;
    if (!fullName.trim()) {
      setError(lang.formatMessage({ id: "alarm_fullname" }));
      return;
    }
    setModalType("add2")
    setFullName(fullName);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setError("");

    const emailInput = e.target.email.value;
    const usernameInput = e.target.username.value;
    const passwordInput = e.target.password.value;
    const confirmPassword = e.target.confirmpassword.value;

    if (!emailInput.trim()) {
      setError(lang.formatMessage({ id: "alarm_email" }));
      return;
    }
    if (!usernameInput.trim()) {
      setError(lang.formatMessage({ id: "alarm_username" }));
      return;
    }
    const convertDigit = Number(usernameInput);

    if (!Number.isNaN(convertDigit)) {
      setError(lang.formatMessage({ id: "alarm_username_wrong_number" }));
      return;
    }
    const regex = /[^\w]/;
    if (regex.test(usernameInput)) {
      setError(lang.formatMessage({ id: "alarm_username_wrong" }))
      return;
    }
    if (!passwordInput) {
      setError(lang.formatMessage({ id: "alarm_password" }));
      return;
    }
    if (!confirmPassword) {
      setError(lang.formatMessage({ id: "alarm_confirm_password" }));
      return; 
    }

    try {
      if(passwordInput.length < 8 || confirmPassword.length < 8 ){
        setError(lang.formatMessage({ id: "alarm_password_number" }));
        return;
      }
      if (passwordInput === confirmPassword) {
        // [MOCKED] API thật bị comment lại, dùng mockRenderOtp thay thế
        // const res = await callApi(
        //   "post",
        //   `${process.env.REACT_APP_API}/data/renderOtpWhenCreateUser`,
        //   { email: emailInput }
        // );
        const res = await mockRenderOtp(emailInput);
        if (res.status === false) {
          setError(lang.formatMessage({ id: "alarm_email_exist" }));
        } else {
          setModalType("add3")
          setCountdown(60);
          setEmail(emailInput);
          setPassword(passwordInput);
          setUsername(usernameInput);
        }
      } else {
        setError("Mật khẩu xác nhận không trùng khớp!");
      }
    } catch (error) {
      setError(lang.formatMessage({ id: "alarm_email_exist" }));
      console.log(error);
    }
  };

  const handleOtpAgain = async () => {
    setCountdown(60);
    try {
      // [MOCKED] API thật bị comment lại, dùng mockRenderOtp thay thế
      // const res = await callApi(
      //   "post",
      //   `${process.env.REACT_APP_API}/data/renderOtpWhenCreateUser`,
      //   { email: email }
      // );
      const res = await mockRenderOtp(email);
      if (res.status === false) {
        console.log("Error sys");
      } else {
        console.log("Otp has sended");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.some((item) => item === "")) {
      setError(lang.formatMessage({ id: "alarm_otp" }));
      return;
    }
    const otpCode = otp.join("");
    try {
      // [MOCKED] API thật bị comment lại, dùng mockCreateUser thay thế
      // const res = await callApi(
      //   "post",
      //   `${process.env.REACT_APP_API}/data/createUser`,
      //   {
      //     otp: otpCode,
      //     email: email,
      //     username: username,
      //     password: password,
      //     name: fullName,
      //     roleId: Number(roleUser),
      //     status: statusUser,
      //   }
      // );
      const res = await mockCreateUser({
        otp: otpCode,
        email: email,
        username: username,
        password: password,
        name: fullName,
        roleId: Number(roleUser),
        status: statusUser,
      });
      if (res.status === false) {
        setError(lang.formatMessage({ id: "alarm_wrong_otp" }));
      } else {
        toast.success(lang.formatMessage({ id: "toast_created" }))
        setModalType(null)
        setOtp(["", "", "", "", "", ""]);
        loadUser();
      }
    } catch (error) {
      setError(lang.formatMessage({ id: "alarm_wrong_otp" }));
    }
  };

  const loadRole = async () => {
    try {
      // [MOCKED] API thật bị comment lại, dùng mockGetAllRoles thay thế
      // const response = await callApi(
      //   "get",
      //   `${process.env.REACT_APP_API}/data/getAllRoles?status=active`
      // );
      const response = await mockGetAllRoles();
      if (response.status === true) {
        setRoles(response?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadRole();
  }, []);

  const renderTitle = () => {
    switch (modalType) {
      case "add1":
      case "add2":
      case "add3":
        return lang.formatMessage({ id: "user_modal_add_title" });
      case "view":
        return `${lang.formatMessage({ id: "user_information" })} USR-${String(selectedUser.id).padStart(3, "0")}`
      case "edit":
        return lang.formatMessage({ id: "user_modal_edit_title" });
      case "delete":
        return lang.formatMessage({ id: "confirm_delete" });
      default:
        return "";
    }
  };

  const renderModalViewMobile = () => {
    return (
      <div className="DAT_UserManagementMobile_Modal_Container_Main">
        {userInfo.map((item, index) => (
          <div key={index} className="DAT_UserManagementMobile_Modal_Container_Main_Row">
            <div className="DAT_UserManagementMobile_Modal_Container_Main_Row_Label">{item.label}</div>
            <div className="DAT_UserManagementMobile_Modal_Container_Main_Row_Value">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    )
  }

  const renderModalAddStep1 = () => {
    return (
      <form className="DAT_UserManagement_Modal_Container_Main"
        onSubmit={handleSubmitStep1}
        id="step1"
        key={modalType}
      >
        <label className="DAT_UserManagement_Modal_Container_Main_Label">{lang.formatMessage({ id: "user_modal_full_name" })}</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Box">
          <input name="fullname" type="text" />
        </div>
        <div className="DAT_UserManagement_Modal_Container_Main_Form">
          <div className="DAT_UserManagement_Modal_Container_Main_Form_Item">
            <label className="DAT_UserManagement_Modal_Container_Main_Form_Item_Label">{lang.formatMessage({ id: "user_modal_role" })}</label>
            <select className="DAT_UserManagement_Modal_Container_Main_Form_Item_Select" onChange={(e) => setRoleUser(e.target.value)} value={roleUser}>
              {roles.map((item) => (
                <option key={item.id} value={item.id}>{item.roleName}</option>
              ))}
            </select>
          </div>
          <div className="DAT_UserManagement_Modal_Container_Main_Form_Item">
            <label className="DAT_UserManagement_Modal_Container_Main_Form_Item_Label">{lang.formatMessage({ id: "user_modal_status" })}</label>
            <select className="DAT_UserManagement_Modal_Container_Main_Form_Item_Select" onChange={(e) => setStatusUser(e.target.value)} value={statusUser}>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
            </select>
          </div>
        </div>
        {error && <div className="DAT_UserManagement_Modal_Container_Main_Error">{error}</div>}
      </form>
    )
  }

  const renderModalAddStep2 = () => {
    return (
      <form className="DAT_UserManagement_Modal_Container_Main"
        onSubmit={handleSubmitStep2}
        id="step2"
        key={modalType}>
        <label className="DAT_UserManagement_Modal_Container_Main_Label">Email</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Box"><input name="email" type="email" /></div>
        <label className="DAT_UserManagement_Modal_Container_Main_Label">{lang.formatMessage({ id: "username" })}</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Box"><input name="username" type="text" /></div>
        <label className="DAT_UserManagement_Modal_Container_Main_Label">{lang.formatMessage({ id: "password" })}</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Box"><input name="password" type="password" /></div>
        <label className="DAT_UserManagement_Modal_Container_Main_Label">{lang.formatMessage({ id: "confirm_password" })}</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Box"><input name="confirmpassword" type="password" /></div>
        {error && <div className="DAT_UserManagement_Modal_Container_Main_Error">{error}</div>}
      </form>
    )
  }

  const renderModalAddStep3 = () => {
    return (
      <form id="step3" className="DAT_UserManagement_Modal_Container_Main" onSubmit={handleSubmitStep3} key={modalType}>
        <label className="DAT_UserManagement_Modal_Container_Main_Label">{lang.formatMessage({ id: "input_otp" })}</label>
        <div className="DAT_UserManagement_Modal_Container_Main_Otp">
          {otp.map((digit, index) => (
            <input
              className="DAT_UserManagement_Modal_Container_Main_Otp_Input"
              key={index}
              value={otp[index]}
              ref={(el) => (otpRefs.current[index] = el)}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              maxLength={1}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
            />
          ))}
        </div>
        {countdown > 0 ? (
          <div className="DAT_UserManagement_Modal_Container_Main_Resend">
            {lang.formatMessage({ id: "resend_otp_after" })} {countdown}s
          </div>
        ) : (
          <div className="DAT_UserManagement_Modal_Container_Main_Resend DAT_UserManagement_Modal_Container_Main_Resend_Active" onClick={handleOtpAgain}>
            {lang.formatMessage({ id: "resend_otp" })}
          </div>
        )}
        {error && <div className="DAT_UserManagement_Modal_Container_Main_Error">{error}</div>}
      </form>
    )
  }

  const renderBody = () => {
    switch (modalType) {
      case "add1":
        return renderModalAddStep1();
      case "add2":
        return renderModalAddStep2();
      case "add3":
        return renderModalAddStep3();
      case "view":
        return renderModalViewMobile();
      case "edit":
        return renderModalFormBody();
      case "delete":
        return lang.formatMessage({ id: "description_delete" })
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (modalType) {
      case "add1":
        return (
          <>
            <button type="button" className="DAT_UserManagement_Modal_Container_Foot_Button_Secondary" onClick={() => setModalType(null)}>
              {lang.formatMessage({ id: "modal_cancel" })}
            </button>
            <button className="DAT_UserManagement_Modal_Container_Foot_Button_Primary"
              type="submit"
              form="step1">
              {lang.formatMessage({ id: "next" })}
            </button>
          </>
        )
      case "add2":
        return (
          <>
            <button type="button" className="DAT_UserManagement_Modal_Container_Foot_Button_Secondary" onClick={() => { setModalType("add1"); setError("") }}>
              {lang.formatMessage({ id: "go_back" })}
            </button>
            <button type="submit" className="DAT_UserManagement_Modal_Container_Foot_Button_Primary"
              form="step2">
              {lang.formatMessage({ id: "next" })}
            </button>
          </>
        )
      case "add3":
        return (
          <>
            <button type="button" className="DAT_UserManagement_Modal_Container_Foot_Button_Secondary" onClick={() => setModalType("add2")}>
              {lang.formatMessage({ id: "go_back" })}
            </button>
            <button className="DAT_UserManagement_Modal_Container_Foot_Button_Primary" type="submit" form="step3">
              {lang.formatMessage({ id: "user_modal_add_title" })}
            </button>
          </>
        )
      case "view":
        return (
          <>
            {permissions?.["users"]?.includes(defaultPermissions.update) && (
              <div className="DAT_UserManagementMobile_Modal_Container_Foot_Button_Primary" onClick={() => { openEdit(selectedUser); }}>
                {lang.formatMessage({ id: "user_edit_button" })}
              </div>
            )}
            {userId !== selectedUser.id && permissions?.["users"]?.includes(defaultPermissions.delete) && (
              <div className="DAT_UserManagementMobile_Modal_Container_Foot_Btn_Delete"
                onClick={() => {
                  setModalType("delete"); setDeleteUserId(selectedUser.id);
                }}>
                {lang.formatMessage({ id: "user_delete_button" })}
              </div>
            )}
          </>
        )
      case "edit":
        return (
          <>
            <div className="DAT_UserManagement_Modal_Container_Foot_Button_Primary" onClick={() => { saveUser() }}>
              {lang.formatMessage({ id: "user_save_button" })}
            </div>
          </>
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
              onClick={() => {
                handleDelete()
              }}
            >
              {lang.formatMessage({
                id: "user_delete_button",
              })}
            </button>
          </>
        )
      default:
        return null;
    }
  };

  const renderModalFormBody = () => (
    <div className="DAT_UserManagement_Form_Grid">
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">Username</label>
        <input
          className="DAT_UserManagement_Form_Grid_Group_Input"
          value={form.userName || ""}
          disabled
        />
      </div>
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">
          {lang.formatMessage({ id: "user_modal_email" })}
        </label>
        <input
          className="DAT_UserManagement_Form_Grid_Group_Input"
          value={form.email || ""}
          disabled
        />
      </div>
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">
          {lang.formatMessage({ id: "user_modal_full_name" })}
        </label>
        <input
          className="DAT_UserManagement_Form_Grid_Group_Input"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">
          {lang.formatMessage({ id: "user_modal_password" })}
        </label>
        <input
          className="DAT_UserManagement_Form_Grid_Group_Input"
          type="password"
          value={form.password || ""}
          placeholder={editing ? "Bỏ trống nếu không đổi" : ""}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">
          {lang.formatMessage({ id: "user_modal_role" })}
        </label>
        <select
          className="DAT_UserManagement_Form_Grid_Group_Select"
          value={Number(form.role)}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {roles.map((item) => (
            <option key={item.id} value={item.id}>{item.roleName}</option>
          ))}
        </select>
      </div>
      <div className="DAT_UserManagement_Form_Grid_Group">
        <label className="DAT_UserManagement_Form_Grid_Group_Label">
          {lang.formatMessage({ id: "user_modal_status" })}
        </label>
        <select
          className="DAT_UserManagement_Form_Grid_Group_Select"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="locked">Locked</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="DAT_UserManagementMobile">
          <div className="DAT_UserManagementMobile_Card">
            <div className="DAT_UserManagementMobile_Card_Info">
              <div className="DAT_UserManagementMobile_Card_Info_Icon">
                <LuUsers size={25} />
              </div>
              <div className="DAT_UserManagementMobile_Card_Info_Title">
                {lang.formatMessage({ id: "user_management" })}
              </div>
            </div>
            <div className="DAT_UserManagementMobile_Card_Actions">
              <input
                className="DAT_UserManagementMobile_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "user_search" })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {permissions?.["users"]?.includes(defaultPermissions.create) && (
                <button className="DAT_UserManagement_Card_Actions_Button_Primary" onClick={() => { setModalType("add1"); setStep(1); setError(""); }}>
                  <LuUserPlus />
                </button>
              )}
              <select
                className="DAT_UserManagementMobile_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="All">{lang.formatMessage({ id: "all_role" })}</option>
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>{item.roleName}</option>
                ))}
              </select>
              <select
                className="DAT_UserManagementMobile_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">{lang.formatMessage({ id: "all_status_role" })}</option>
                <option value="active">{lang.formatMessage({ id: "statusActive_role" })}</option>
                <option value="locked">{lang.formatMessage({ id: "statusLocked_role" })}</option>
              </select>
              {permissions?.["users"]?.includes(defaultPermissions.recovery) && (
                <button className="DAT_UserManagementMobile_Card_Actions_Button_Primary" onClick={() => navigate("/user-recovery")}>
                  {lang.formatMessage({ id: "user_button_recovery" })}
                </button>
              )}
            </div>

          </div>

          <div className="DAT_UserManagementMobile_Container">
            {filtered.map((user) => (
              <div key={user.id} className="DAT_UserManagementMobile_Container_Card">
                <div className="DAT_UserManagementMobile_Container_Card_Avt">
                  <LuUser />
                </div>
                <div className="DAT_UserManagementMobile_Container_Card_Info">
                  <div className="DAT_UserManagementMobile_Container_Card_Info_Title">{user.name}</div>
                  <div className="DAT_UserManagementMobile_Container_Card_Info_Text">{user.email}</div>
                </div>
                <div
                  className="DAT_UserManagementMobile_Container_Card_Button"
                  onClick={() => {
                    setSelectedUser(user);
                    setModalType("view");
                  }}
                >
                  {lang.formatMessage({ id: "view_details" })}
                </div>
              </div>
            ))}
          </div>

          <Modal
            isOpen={modalType !== null}
            onClose={() => setModalType(null)}
            title={renderTitle()}
            footer={renderFooter()}
          >
            {renderBody()}
          </Modal>
        </div>
      ) : (
        <div className="DAT_UserManagement">
          <div className="DAT_UserManagement_Card">
            <div className="DAT_UserManagement_Card_Info">
              <div className="DAT_UserManagement_Card_Info_Icon">
                <LuUsers size={25} />
              </div>
              <div className="DAT_UserManagement_Card_Info_Title">
                {lang.formatMessage({ id: "user_management" })}
              </div>
            </div>
            <div className="DAT_UserManagement_Card_Actions">
              <input
                className="DAT_UserManagement_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "user_search" })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="DAT_UserManagement_Card_Actions_FilterSelect"
                style={{ width: 100 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="All">{lang.formatMessage({ id: "all_role" })}</option>
                {roles.map((item) => (
                  <option key={item.id} value={item.id}>{item.roleName}</option>
                ))}
              </select>
              <select
                className="DAT_UserManagement_Card_Actions_FilterSelect"
                style={{ width: 100 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">{lang.formatMessage({ id: "all_status_role" })}</option>
                <option value="active">{lang.formatMessage({ id: "statusActive_role" })}</option>
                <option value="locked">{lang.formatMessage({ id: "statusLocked_role" })}</option>
              </select>
              {permissions?.["users"]?.includes(defaultPermissions.recovery) && (
                <button className="DAT_UserManagement_Card_Actions_Button_Primary" onClick={() => navigate("/user-recovery")}>
                  {lang.formatMessage({ id: "user_button_recovery" })}
                </button>
              )}
              {permissions?.["users"]?.includes(defaultPermissions.create) && (
                <button className="DAT_UserManagement_Card_Actions_Button_Primary" onClick={() => { setModalType("add1"); setStep(1); setError(""); }}>
                  {lang.formatMessage({ id: "add_user" })}
                </button>
              )}
            </div>
          </div>

          <div className="DAT_UserManagement_Container">
            <div className="DAT_UserManagement_Container_Table">
              <table className="DAT_UserManagement_Container_Table_Main">
                <thead>
                  <tr>
                    <th>{lang.formatMessage({ id: "user_id_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_name_table" })}</th>
                    <th>Username</th>
                    <th>{lang.formatMessage({ id: "user_email_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_role_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_status_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_create_at_table" })}</th>
                    {(permissions?.["users"]?.includes(defaultPermissions.delete) || permissions?.["users"]?.includes(defaultPermissions.update)) && (
                      <th>{lang.formatMessage({ id: "user_action_table" })}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="DAT_UserManagement_Container_Table_Main_Body">
                  {filtered.map((user) => {
                    const isLastItem = user.id === filtered[filtered.length - 1]?.id;
                    return (
                      <tr key={user.id} className="DAT_UserManagement_Container_Table_Main_Row">
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">USR-{String(user.id).padStart(3, "0")}</td>
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.name}</td>
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.userName}</td>
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.email}</td>
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.roleName}</td>
                        <td className={`DAT_UserManagement_Container_Table_Main_Cell--${user.status}`}>
                          {user.status === "active" ? "Active" : "Locked"}
                        </td>
                        <td className="DAT_UserManagement_Container_Table_Main_Cell">
                          {user.created ? new Date(user.created).toLocaleString("vi-VN") : "-"}
                        </td>
                        {(permissions?.["users"]?.includes(defaultPermissions.delete) || permissions?.["users"]?.includes(defaultPermissions.update)) && (
                          <td className="DAT_UserManagement_Container_Table_Main_Cell">
                            <div className="DAT_UserManagement_Container_Table_Actions" ref={userRef}>
                              <button className="DAT_UserManagement_Container_Table_Actions_Button_GhostSm" onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}>
                                <LuMenu />
                              </button>

                              {openMenu === user.id && (
                                <div className={`DAT_UserManagement_Pop_Menu ${isLastItem ? "DAT_UserManagement_Pop_MenuLast" : ""}`} onMouseDown={(e) => e.stopPropagation()}>
                                  {permissions?.["users"]?.includes(defaultPermissions.update) && (
                                    <div className="DAT_UserManagement_Pop_MenuItem" onClick={() => { openEdit(user); setOpenMenu(null); }}>
                                      {lang.formatMessage({ id: "user_edit_button" })}
                                    </div>
                                  )}
                                  {userId !== user.id && permissions?.["users"]?.includes(defaultPermissions.delete) && (
                                    <div className="DAT_UserManagement_Pop_MenuItem" style={{ color: "red" }}
                                      onClick={() => {
                                        setModalType("delete"); setOpenMenu(null); setDeleteUserId(user.id);
                                      }}>
                                      {lang.formatMessage({ id: "user_delete_button" })}
                                    </div>
                                  )}

                                </div>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Modal
            isOpen={modalType !== null}
            onClose={() => setModalType(null)}
            title={renderTitle()}
            footer={renderFooter()}
          >
            {renderBody()}
          </Modal>
        </div>
      )}
    </>
  );
}