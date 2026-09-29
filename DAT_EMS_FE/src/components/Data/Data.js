// ==========================================
// 1. DANH SÁCH DỰ ÁN (PROJECTS)
// ==========================================
export const projects = [
  {
    id: 1,
    name: "Nhà máy Embody Solar",
    address: "KCN VSIP II, Bình Dương",
    location: "Bình Dương",
    status: "Đang vận hành",
    createdAt: "12/06/2026",
  },
  {
    id: 2,
    name: "DAT Battery Lab",
    address: "Quận 7, TP. Hồ Chí Minh",
    location: "TP. Hồ Chí Minh",
    status: "Đang vận hành",
    createdAt: "18/06/2026",
  },
  {
    id: 3,
    name: "Kho lạnh Mekong",
    address: "KCN Trà Nóc, Cần Thơ",
    location: "Cần Thơ",
    status: "Cảnh báo",
    createdAt: "25/06/2026",
  },
  {
    id: 4,
    name: "Khu văn phòng Lotus",
    address: "Hải Châu, Đà Nẵng",
    location: "Đà Nẵng",
    status: "Cảnh báo",
    createdAt: "01/07/2026",
  },
  {
    id: 5,
    name: "Cụm xưởng Precision",
    address: "KCN Long Thành, Đồng Nai",
    location: "Đồng Nai",
    status: "Đang vận hành",
    createdAt: "08/07/2026",
  },
];

// ==========================================
// 2. HỆ THỐNG ĐIỆN (ELECTRIC)
// ==========================================
export const electricDiagramData = [
  {
    id: 1,
    data: {
      title: "MCB TỔNG 1",
      metrics: [
        { label: "NĂNG LƯỢNG:", value: "123,456", unit: "kWh" },
        { label: "CÔNG SUẤT:", value: "45.67", unit: "kW" },
      ],
    },
    children: [
      {
        id: 11,
        data: {
          title: "DEMO TRẠM KHÍ 1",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "17,660", unit: "Nm³" },
            { label: "CÔNG SUẤT:", value: "300.3", unit: "Nm³/h" },
          ],
        },
        children: [],
      },
      {
        id: 12,
        data: {
          title: "DEMO MOTO PMSM 1",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "12,345", unit: "kWh" },
            { label: "CÔNG SUẤT:", value: "5.23", unit: "kW" },
          ],
        },
        children: [],
      },
      {
        id: 14,
        data: {
          title: "DEMO BESS 1",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "1,850", unit: "kWh" },
            { label: "CÔNG SUẤT:", value: "25.0", unit: "kW" },
          ],
        },
        children: [],
      },
    ],
  },
  {
    id: 2,
    data: {
      title: "MCB TỔNG 2",
      metrics: [
        { label: "NĂNG LƯỢNG:", value: "98,720", unit: "kWh" },
        { label: "CÔNG SUẤT:", value: "38.12", unit: "kW" },
      ],
    },
    children: [
      {
        id: 21,
        data: {
          title: "DEMO TRẠM KHÍ 2",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "14,210", unit: "Nm³" },
            { label: "CÔNG SUẤT:", value: "245.0", unit: "Nm³/h" },
          ],
        },
        children: [],
      },
      {
        id: 22,
        data: {
          title: "DEMO MOTO PMSM 2",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "9,870", unit: "kWh" },
            { label: "CÔNG SUẤT:", value: "4.15", unit: "kW" },
          ],
        },
        children: [],
      },
      {
        id: 23,
        data: {
          title: "DEMO BESS 2",
          metrics: [
            { label: "NĂNG LƯỢNG:", value: "2,100", unit: "kWh" },
            { label: "CÔNG SUẤT:", value: "30.0", unit: "kW" },
          ],
        },
        children: [],
      },
    ],
  },
];

const defaultElectricDetail = {
  title: "Giám sát chi tiết Điện năng MCB TỔNG",
  energy: {
    total: "25.647,59",
    today: "89,99",
    month: "5.652,61",
    year: "25.647,59",
    yesterday: "77,05",
    previousMonth: "5.865,97",
    previousYear: "4.328,12",
    dayChange: "+16,79%",
    monthChange: "-3,62%",
    yearChange: "+492,29%",
  },
  powers: [
    { label: "Công suất tiêu thụ", value: "6,64", unit: "kW" },
    { label: "reactivePower", value: "4,25", unit: "kVAR" },
    { label: "apparentPower", value: "17,72", unit: "kVA" },
  ],
  phases: [
    {
      phase: "A",
      subLabel: "Pha A",
      color: "purple",
      voltage: "232,74",
      current: "8,15",
    },
    {
      phase: "B",
      subLabel: "Pha B",
      color: "green",
      voltage: "233,05",
      current: "12,51",
    },
    {
      phase: "C",
      subLabel: "Pha C",
      color: "cyan",
      voltage: "234,06",
      current: "8,89",
    },
  ],
  quality: [
    {
      phase: "A",
      subLabel: "Pha A",
      color: "purple",
      thdv: "1,82",
      thdi: "4,21",
    },
    {
      phase: "B",
      subLabel: "Pha B",
      color: "green",
      thdv: "2,05",
      thdi: "3,87",
    },
    {
      phase: "C",
      subLabel: "Pha C",
      color: "cyan",
      thdv: "1,64",
      thdi: "4,53",
    },
  ],
  chart: [
    { time: "00:00", kw: 34 },
    { time: "02:00", kw: 32 },
    { time: "04:00", kw: 34 },
    { time: "06:00", kw: 22 },
    { time: "08:00", kw: 55 },
    { time: "10:00", kw: 73 },
    { time: "12:00", kw: 65 },
    { time: "14:00", kw: 68 },
    { time: "16:00", kw: 59 },
    { time: "18:00", kw: 38 },
    { time: "20:00", kw: 24 },
    { time: "22:00", kw: 18 },
    { time: "24:00", kw: 16 },
  ],
};

export const electricDetailData = {
  1: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng MCB TỔNG 1",
  },
  11: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO TRẠM KHÍ 1",
  },
  12: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO MOTO PMSM 1",
  },
  13: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO SOLAR 1",
  },
  14: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO BESS 1",
  },
  2: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng MCB TỔNG 2",
  },
  21: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO TRẠM KHÍ 2",
  },
  22: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO MOTO PMSM 2",
  },
  23: {
    ...defaultElectricDetail,
    title: "Giám sát chi tiết Điện năng DEMO BESS 2",
  },
};

// ==========================================
// 3. HỆ THỐNG NƯỚC (WATER)
// ==========================================
export const waterDiagramData = [
  {
    id: 1,
    data: {
      title: "TRẠM TỔNG NƯỚC",
      metrics: [
        { label: "TỔNG TIÊU THỤ:", value: "1.860", unit: "m³" },
        { label: "LƯU LƯỢNG:", value: "72.8", unit: "m³/h" },
      ],
    },
    children: [
      {
        id: 101,
        data: {
          title: "DEMO 4 BƠM",
          metrics: [
            { label: "TỔNG TIÊU THỤ:", value: "1.240", unit: "m³" },
            { label: "LƯU LƯỢNG:", value: "48.5", unit: "m³/h" },
          ],
        },
        children: [],
      },
      {
        id: 102,
        data: {
          title: "DEMO 2 BƠM",
          metrics: [
            { label: "TỔNG TIÊU THỤ:", value: "620", unit: "m³" },
            { label: "LƯU LƯỢNG:", value: "24.3", unit: "m³/h" },
          ],
        },
        children: [],
      },
    ],
  },
  {
    id: 2,
    data: {
      title: "TRẠM TỔNG NƯỚC 2",
      metrics: [
        { label: "TỔNG TIÊU THỤ:", value: "2.450", unit: "m³" },
        { label: "LƯU LƯỢNG:", value: "95.0", unit: "m³/h" },
      ],
    },
    children: [
      {
        id: 201,
        data: {
          title: "DEMO 6 BƠM",
          metrics: [
            { label: "TỔNG TIÊU THỤ:", value: "1.850", unit: "m³" },
            { label: "LƯU LƯỢNG:", value: "68.2", unit: "m³/h" },
          ],
        },
        children: [],
      },
    ],
  },
];

const defaultWaterDetail = {
  title: "Giám sát chi tiết Nước TRẠM TỔNG NƯỚC",
  pressure: { value: "3,85", unit: "Bar", desc: "Áp suất đường ống" },
  flowRate: { value: "48,5", unit: "m³ /h", desc: "Lưu lượng tức thời" },
  totalVolume: { value: "1.240", unit: "m³", desc: "Thể tích tích lũy" },
  chart: [
    { time: "00:00", value: 31.0 },
    { time: "04:00", value: 28.2 },
    { time: "08:00", value: 52.4 },
    { time: "12:00", value: 48.5 },
    { time: "16:00", value: 55.1 },
    { time: "20:00", value: 40.0 },
  ],
};

export const waterDetailData = {
  1: { ...defaultWaterDetail, title: "Giám sát chi tiết Nước TRẠM TỔNG NƯỚC" },
  101: {
    title: "Giám sát chi tiết Nước DEMO 4 BƠM",
    pressure: { value: "3,80", unit: "Bar", desc: "Áp suất đầu đẩy" },
    flowRate: { value: "48,5", unit: "m³ /h", desc: "Lưu lượng trạm 4 bơm" },
    totalVolume: { value: "1.240", unit: "m³", desc: "Tổng lượng nước bơm" },
    chart: defaultWaterDetail.chart,
  },
  102: {
    title: "Giám sát chi tiết Nước DEMO 2 BƠM",
    pressure: { value: "2,95", unit: "Bar", desc: "Áp suất đầu đẩy" },
    flowRate: { value: "24,3", unit: "m³ /h", desc: "Lưu lượng trạm 2 bơm" },
    totalVolume: { value: "620", unit: "m³", desc: "Tổng lượng nước bơm" },
    chart: [
      { time: "00:00", value: 15.5 },
      { time: "04:00", value: 14.0 },
      { time: "08:00", value: 24.3 },
      { time: "12:00", value: 22.1 },
      { time: "16:00", value: 26.0 },
      { time: "20:00", value: 18.4 },
    ],
  },
  2: {
    ...defaultWaterDetail,
    title: "Giám sát chi tiết Nước TRẠM TỔNG NƯỚC 2",
  },
  201: { ...defaultWaterDetail, title: "Giám sát chi tiết Nước DEMO 6 BƠM" },
};
// ==========================================
// 4. HỆ THỐNG KHÍ NÉN (COMPRESSED AIR)
// ==========================================
export const compressedAirDiagramData = [
  {
    id: 1,
    data: {
      title: "TRẠM TỔNG KHÍ",
      metrics: [
        { label: "TỔNG TIÊU THỤ KHÍ", value: "17.660", unit: "Nm³" },
        { label: "LƯU LƯỢNG KHÍ", value: "300.3", unit: "Nm³/h" },
      ],
    },
    children: [
      {
        id: 101,
        data: {
          title: "TRẠM KHÍ NHÀ KÍNH",
          metrics: [
            { label: "TỔNG TIÊU THỤ KHÍ", value: "8.520", unit: "Nm³" },
            { label: "LƯU LƯỢNG KHÍ", value: "142.3", unit: "Nm³/h" },
          ],
        },
        children: [],
      },
      {
        id: 102,
        data: {
          title: "TRẠM KHÍ PHÂN XƯỞNG",
          metrics: [
            { label: "TỔNG TIÊU THỤ KHÍ", value: "9.140", unit: "Nm³" },
            { label: "LƯU LƯỢNG KHÍ", value: "158.0", unit: "Nm³/h" },
          ],
        },
        children: [],
      },
    ],
  },
];

const defaultAirDetail = {
  title: "Giám sát chi tiết Khí nén TRẠM TỔNG KHÍ",
  pressure: { value: "6,82", unit: "Bar", desc: "Áp suất đường ống" },
  flowRate: { value: "142,3", unit: "m³ /h", desc: "Lưu lượng tức thời" },
  totalVolume: { value: "8.520", unit: "Nm³", desc: "Thể tích tích lũy" },
  chart: [
    { time: "00:00", value: 110.5 },
    { time: "04:00", value: 105.0 },
    { time: "08:00", value: 152.4 },
    { time: "12:00", value: 142.3 },
    { time: "16:00", value: 158.0 },
    { time: "20:00", value: 125.0 },
  ],
};

export const compressedAirDetailData = {
  1: { ...defaultAirDetail, title: "Giám sát chi tiết Khí nén TRẠM TỔNG KHÍ" },
  101: {
    title: "Giám sát chi tiết Khí nén TRẠM KHÍ NHÀ KÍNH",
    pressure: { value: "6,82", unit: "Bar", desc: "Áp suất đường ống" },
    flowRate: { value: "142,3", unit: "m³ /h", desc: "Lưu lượng tức thời" },
    totalVolume: { value: "8.520", unit: "Nm³", desc: "Thể tích tích lũy" },
    chart: defaultAirDetail.chart,
  },
  102: {
    title: "Giám sát chi tiết Khí nén TRẠM KHÍ PHÂN XƯỞNG",
    pressure: { value: "7,15", unit: "Bar", desc: "Áp suất đường ống xưởng" },
    flowRate: { value: "158,0", unit: "m³ /h", desc: "Lưu lượng phân xưởng" },
    totalVolume: { value: "9.140", unit: "Nm³", desc: "Thể tích tích lũy" },
    chart: [
      { time: "00:00", value: 115.0 },
      { time: "04:00", value: 112.0 },
      { time: "08:00", value: 165.0 },
      { time: "12:00", value: 158.0 },
      { time: "16:00", value: 172.0 },
      { time: "20:00", value: 130.0 },
    ],
  },
};

// ==========================================
// 5. MOCK DỮ LIỆU CHO Energy Report
// ==========================================
// Mock cho API "calculate" - tổng sản lượng charge/discharge theo ngày/tháng đang chọn
export const MOCK_CALCULATE_DATA = {
  charge: 128.5,
  discharge: 96.3,
};

// Hàm tiện ích tạo số ngẫu nhiên trong khoảng [min, max], làm tròn theo số chữ số thập phân
export const randomInRange = (min, max, decimals = 1) => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

// Sinh 24 bản ghi theo giờ (00:00 -> 23:00) cho một ngày, dùng chung cho
// MOCK_ALL_REPORT (chart) và MOCK_REPORT_PAGINATION (bảng chi tiết)
export const generateHourlyMockReport = (dateStr = "2026-08-25") => {
  return Array.from({ length: 24 }, (_, hour) => {
    const timeLabel = `${String(hour).padStart(2, "0")}:00`;
    return {
      date: dateStr,
      time: timeLabel,
      soc: randomInRange(20, 100, 0), // % dung lượng pin
      soh: randomInRange(85, 100, 0), // % tình trạng pin
      charge: randomInRange(0, 8, 2), // kWh
      discharge: randomInRange(0, 6, 2), // kWh
      volt: randomInRange(48, 55, 1), // V
      current: randomInRange(-20, 20, 1), // A
      grid: randomInRange(0, 5, 2), // kW - grid import
      load: randomInRange(1, 10, 2), // kW - tiêu thụ tải
    };
  });
};

// Mock cho API "getAllReport" - dữ liệu dùng để vẽ biểu đồ (charge/discharge/soc/volt/current)
export const MOCK_ALL_REPORT = generateHourlyMockReport();

// Mock cho API "getAllReportPagination" - dữ liệu bảng chi tiết có phân trang
export const MOCK_REPORT_PAGINATION = {
  data: generateHourlyMockReport(),
  totalPage: 5, // giả lập có 5 trang dữ liệu
};

// Ngày "mới nhất" giả lập - dùng làm mốc mặc định khi component load lần đầu
export const MOCK_LATEST_DATE = "2026-08-25";

// Sinh chuỗi ngày YYYY-MM-DD lùi lại `daysAgo` ngày so với MOCK_LATEST_DATE
export const getMockDateString = (daysAgo) => {
  const base = new Date(MOCK_LATEST_DATE);
  base.setDate(base.getDate() - daysAgo);
  return base.toISOString().slice(0, 10);
};

// Mock cho "mockEnergyReportHourly" - dữ liệu theo giờ, dùng cho view "day"
// Sinh cho 3 ngày gần nhất (mỗi ngày 24 bản ghi) để có thể chuyển đổi qua lại giữa các ngày khi test
export const mockEnergyReportHourly = Array.from(
  { length: 3 },
  (_, dayOffset) => {
    const dateStr = getMockDateString(dayOffset);
    return Array.from({ length: 24 }, (_, hour) => ({
      date: dateStr,
      time: `${String(hour).padStart(2, "0")}:00`,
      charge: randomInRange(0, 8, 2),
      discharge: randomInRange(0, 6, 2),
      pv: randomInRange(0, 5, 2),
      gridImport: randomInRange(0, 4, 2),
      gridExport: randomInRange(0, 2, 2),
      load: randomInRange(1, 10, 2),
      efficiency: randomInRange(85, 98, 1),
      cycles: randomInRange(0, 1, 2),
      soc: randomInRange(20, 100, 0),
      soh: randomInRange(85, 100, 0),
      volt: randomInRange(48, 55, 1),
      current: randomInRange(-20, 20, 1),
    }));
  },
).flat();

// Mock cho "mockEnergyReport" - dữ liệu tổng hợp theo ngày, dùng cho view "month"
// Sinh cho 30 ngày gần nhất
export const mockEnergyReport = Array.from({ length: 30 }, (_, dayOffset) => ({
  date: getMockDateString(dayOffset),
  charge: randomInRange(50, 150, 2),
  discharge: randomInRange(40, 120, 2),
  pv: randomInRange(30, 100, 2),
  gridImport: randomInRange(10, 80, 2),
  gridExport: randomInRange(5, 40, 2),
  load: randomInRange(80, 200, 2),
  efficiency: randomInRange(85, 98, 1),
  cycles: randomInRange(0, 3, 2),
  soc: randomInRange(20, 100, 0),
  soh: randomInRange(85, 100, 0),
  volt: randomInRange(48, 55, 1),
  current: randomInRange(-20, 20, 1),
}));

// ==========================================
// 6. MOCK DỮ LIỆU CHO Alarm (Socket.IO / API)
// ==========================================

// Mock cho API "readBess" (level: "bmslevel") - dữ liệu tổng quan hệ thống BMS
export const MOCK_BESS_DATA = {
  bmslevel: {
    soc: 76, // % dung lượng pin
    soh: 98, // % tình trạng pin
    voltage: 51.2, // V - tổng điện áp hệ thống
    current: 12.4, // A
    cellVoltageMax: 3.42, // V
    cellVoltageMin: 3.38, // V
    cellTempMax: 32.5, // °C
    cellTempMin: 28.1, // °C
    status: "Normal", // trạng thái hoạt động
  },
  rack1alarmlevel_02: {
    alarmCount: 0,
    status: "Normal",
  },
  rack2alarmlevel_02: {
    alarmCount: 1,
    status: "Warning",
  },
};

// Mô phỏng dữ liệu cập nhật realtime từ Socket.IO ("BESS_DATA")
export const generateMockBessUpdate = () => ({
  bmslevel: {
    soc: randomInRange(60, 100, 0),
    soh: randomInRange(90, 100, 0),
    voltage: randomInRange(48, 54, 1),
    current: randomInRange(-15, 15, 1),
    cellVoltageMax: randomInRange(3.3, 3.5, 2),
    cellVoltageMin: randomInRange(3.2, 3.4, 2),
    cellTempMax: randomInRange(25, 40, 1),
    cellTempMin: randomInRange(20, 30, 1),
    status: "Normal",
  },
});

// ==========================================
// 7. MOCK DỮ LIỆU CHO User Management (API)
// ==========================================

export const MOCK_OTP_CODE = "123456";

export const MOCK_ROLES_DB = [
  { id: 1, roleName: "Admin" },
  { id: 2, roleName: "Manager" },
  { id: 3, roleName: "Viewer" },
];

// "Database" mock cho danh sách user - dùng đúng tên field như backend trả về (id_, full_name_, ...)
export let MOCK_USERS_DB = [
  {
    id_: 1,
    full_name_: "Nguyễn Văn A",
    username_: "nguyenvana",
    email_: "nguyenvana@example.com",
    roleid_: 1,
    rolename_: "Admin",
    status_: "active",
    created_at_: "2026-01-15T08:30:00Z",
  },
  {
    id_: 2,
    full_name_: "Trần Thị B",
    username_: "tranthib",
    email_: "tranthib@example.com",
    roleid_: 2,
    rolename_: "Manager",
    status_: "active",
    created_at_: "2026-02-20T09:15:00Z",
  },
  {
    id_: 3,
    full_name_: "Lê Văn C",
    username_: "levanc",
    email_: "levanc@example.com",
    roleid_: 3,
    rolename_: "Viewer",
    status_: "locked",
    created_at_: "2026-03-10T13:45:00Z",
  },
];

export const getRoleName = (roleId) =>
  MOCK_ROLES_DB.find((r) => String(r.id) === String(roleId))?.roleName || "";

// Mock cho API "getAllUser"
export const mockGetAllUser = async () => {
  return { status: true, data: MOCK_USERS_DB };
};

// Mock cho API "getAllRoles"
export const mockGetAllRoles = async () => {
  return { status: true, data: MOCK_ROLES_DB };
};

// Mock cho API "updateUser" - dùng chung cho cả "cập nhật thông tin" và "đổi trạng thái"
export const mockUpdateUser = async (payload) => {
  const targetId =
    payload.action === "updateStatus" ? payload.id : payload.userId;
  const index = MOCK_USERS_DB.findIndex(
    (u) => String(u.id_) === String(targetId),
  );
  if (index === -1) {
    return { status: false, msg: "User not found" };
  }

  if (payload.action === "updateStatus") {
    MOCK_USERS_DB[index] = { ...MOCK_USERS_DB[index], status_: payload.status };
  } else {
    MOCK_USERS_DB[index] = {
      ...MOCK_USERS_DB[index],
      full_name_: payload.fullName,
      roleid_: payload.roleId,
      rolename_: getRoleName(payload.roleId),
      status_: payload.status,
    };
  }

  return { status: true, data: MOCK_USERS_DB[index] };
};

// Mock cho API "deleteUser"
export const mockDeleteUser = async (userId) => {
  const beforeLength = MOCK_USERS_DB.length;
  MOCK_USERS_DB = MOCK_USERS_DB.filter((u) => String(u.id_) !== String(userId));
  return { status: MOCK_USERS_DB.length < beforeLength };
};

// Mock cho API "renderOtpWhenCreateUser" - trả về status=false nếu email đã tồn tại
export const mockRenderOtp = async (email) => {
  const exists = MOCK_USERS_DB.some(
    (u) => u.email_.toLowerCase() === String(email).toLowerCase(),
  );
  if (exists) {
    return { status: false, msg: "Email already exists" };
  }
  console.log(`[MOCK] Mã OTP gửi tới ${email}: ${MOCK_OTP_CODE}`);
  return { status: true };
};

// Mock cho API "createUser" - chỉ tạo thành công khi OTP nhập đúng MOCK_OTP_CODE
export const mockCreateUser = async ({
  otp,
  email,
  username,
  name,
  roleId,
  status,
}) => {
  if (otp !== MOCK_OTP_CODE) {
    return { status: false, msg: "Invalid OTP" };
  }
  const newUser = {
    id_: MOCK_USERS_DB.length
      ? Math.max(...MOCK_USERS_DB.map((u) => u.id_)) + 1
      : 1,
    full_name_: name,
    username_: username,
    email_: email,
    roleid_: roleId,
    rolename_: getRoleName(roleId),
    status_: status,
    created_at_: new Date().toISOString(),
  };
  MOCK_USERS_DB = [...MOCK_USERS_DB, newUser];
  return { status: true, data: newUser };
};

export const roleMockData = [
  {
    id: 1,
    roleName: "Administrator",
    status: "active",
    createdAt: "01/06/2026",
    createdBy: "System",
    numberOfUser: 3,
  },
  {
    id: 2,
    roleName: "Operator",
    status: "active",
    createdAt: "03/06/2026",
    createdBy: "Administrator",
    numberOfUser: 8,
  },
  {
    id: 3,
    roleName: "Viewer",
    status: "active",
    createdAt: "05/06/2026",
    createdBy: "Administrator",
    numberOfUser: 12,
  },
  {
    id: 4,
    roleName: "Engineer",
    status: "active",
    createdAt: "08/06/2026",
    createdBy: "Administrator",
    numberOfUser: 6,
  },
  {
    id: 5,
    roleName: "Maintenance",
    status: "inactive",
    createdAt: "12/06/2026",
    createdBy: "Administrator",
    numberOfUser: 2,
  },
  {
    id: 6,
    roleName: "Energy Manager",
    status: "active",
    createdAt: "15/06/2026",
    createdBy: "Administrator",
    numberOfUser: 4,
  },
  {
    id: 7,
    roleName: "Alarm Manager",
    status: "active",
    createdAt: "20/06/2026",
    createdBy: "Administrator",
    numberOfUser: 2,
  },
  {
    id: 8,
    roleName: "Report Viewer",
    status: "inactive",
    createdAt: "25/06/2026",
    createdBy: "Administrator",
    numberOfUser: 5,
  },
  {
    id: 9,
    roleName: "BMS Operator",
    status: "active",
    createdAt: "01/07/2026",
    createdBy: "Administrator",
    numberOfUser: 3,
  },
  {
    id: 10,
    roleName: "PCS Operator",
    status: "active",
    createdAt: "06/07/2026",
    createdBy: "Administrator",
    numberOfUser: 3,
  },
  {
    id: 11,
    roleName: "Site Supervisor",
    status: "active",
    createdAt: "12/07/2026",
    createdBy: "Administrator",
    numberOfUser: 1,
  },
  {
    id: 12,
    roleName: "Guest",
    status: "inactive",
    createdAt: "18/07/2026",
    createdBy: "Administrator",
    numberOfUser: 0,
  },
];
export const UserInfoData = {
  userInfo: {
    id: 1,
    username: "admin",
    name: "Nguyen Van A",
    email: "admin@dat.com",
    image: "/img/user.png",
    phone: "0901234567",
    address: "Ho Chi Minh City",
    roleName: "Administrator",
    permissions: [],
    status: true,

    password: "12345678",
    notificationEnabled: false,
  },
};

const mockValues = {
  electric: {
    instant: [32, 30, 34, 20, 42, 69, 72, 59, 65, 63, 38, 21, 15],
    accumulated: [12800, 16400, 14200, 18800, 15300, 19600, 16100],
  },
  water: {
    instant: [45, 42, 48, 38, 55, 72, 78, 69, 76, 70, 58, 49, 43],
    accumulated: [165, 210, 175, 240, 195, 190, 225],
  },
  gas: {
    instant: [110, 105, 112, 95, 130, 165, 170, 150, 160, 155, 135, 120, 108],
    accumulated: [4200, 4600, 4400, 4900, 4700, 5100, 5100],
  },
  co2: {
    month: [
      21.5, 22.8, 20.9, 24.1, 23.6, 25.2, 24.8, 26.1, 27.4, 26.8, 28.2, 27.7,
      29.1, 30.4, 29.8, 31.2, 30.7, 32.1, 33.4, 32.8, 34.2, 35.1, 34.6, 36.2,
      35.8, 37.1, 36.5, 38.2, 39.1, 40.3,
    ],
    year: [620, 675, 648, 710, 735, 760, 805, 831, 790, 845, 870, 910],
  },
};

const createPeriodValues = (source, count, factor = 1) =>
  Array.from({ length: count }, (_, index) =>
    Math.round(
      source[index % source.length] * factor * (0.94 + (index % 5) * 0.03),
    ),
  );

const getAccumulatedValues = (trendType, period, count) => {
  const source = mockValues[trendType];

  if (trendType === "co2") {
    const periodSource = source[period];
    return Array.from(
      { length: count },
      (_, index) => periodSource[index % periodSource.length],
    );
  }
  if (period === "week") return source.accumulated;
  return createPeriodValues(source.accumulated, 12, 28);
};

const createAccumulatedDates = (anchorDate, period) => {
  if (period === "week") {
    const monday = new Date(anchorDate);
    const daysSinceMonday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - daysSinceMonday);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }

  if (period === "month") {
    const year = anchorDate.getFullYear();
    const month = anchorDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1),
    );
  }

  return Array.from(
    { length: 12 },
    (_, index) => new Date(anchorDate.getFullYear(), index, 1),
  );
};

export const createMockTrendData = ({
  trendType,
  date,
  accumulatedDate = date,
  period,
}) => {
  const source = mockValues[trendType];
  const anchorDate = new Date(`${date}T00:00:00`);
  const accumulatedAnchorDate = new Date(`${accumulatedDate}T00:00:00`);

  const instant = (source.instant || []).map((value, index) => {
    const timestamp = new Date(anchorDate);
    timestamp.setHours(index * 2, 0, 0, 0);
    return { timestamp: timestamp.toISOString(), value };
  });

  const accumulatedDates = createAccumulatedDates(
    accumulatedAnchorDate,
    period,
  );
  const accumulatedValues = getAccumulatedValues(
    trendType,
    period,
    accumulatedDates.length,
  );
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const accumulated = accumulatedDates.map((timestamp, index) => {
    const isFuture = timestamp > today;
    return {
      timestamp: timestamp.toISOString(),
      value: isFuture ? 0 : accumulatedValues[index],
      isFuture,
    };
  });

  return { instant, accumulated };
};

// Cùng contract với API thật: Promise<{ data: { instant, accumulated } }>.
export const mockFetchData = async (params) => ({
  data: createMockTrendData(params),
});
