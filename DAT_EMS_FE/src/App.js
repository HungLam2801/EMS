import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout/MainLayout";
import ProjectLayout from "./components/Layout/ProjectLayout/ProjectLayout";
import Login from "./components/Screen/Login/Login";
import Electric from "./components/Screen/Project/Electric/Electric";
import ElectricDetail from "./components/Screen/Project/Electric/ElectricDetail/ElectricDetail";
import ProjectManagement from "./components/Screen/ProjectManagement/ProjectManagement";
import Water from "./components/Screen/Project/Water/Water";
import WaterDetail from "./components/Screen/Project/Water/WaterDetail/WaterDetail";
import CompressedAir from "./components/Screen/Project/CompressedAir/CompressedAir";
import CompressedAirDetail from "./components/Screen/Project/CompressedAir/CompressedAirDetail/CompressedAirDetail";
import Dashboard from "./components/Screen/Project/Dashboard/Dashboard";
import SystemSetting from "./components/Screen/Project/SystemSetting/SystemSetting";
import Alarm_Project from "./components/Screen/Project/Alarm/Alarm";
import Report from "./components/Screen/Project/Report/Report";
import Alarm from "./components/Screen/Alarm/Alarm";
import { signal } from "@preact/signals-react";
import { io } from "socket.io-client";
import EnergyReport from "./components/Screen/EnergyReport/EnergyReport";
import UserManagement from "./components/Screen/UserManagement/UserManagement";
import Role from "./components/Screen/Role/Role";
import UserInfo from "./components/Screen/UserInfo/UserInfo";

export const socket = signal(io.connect(import.meta.env.REACT_APP_API));

const EmptyPage = () => null;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/alarm" element={<Alarm />} />
          <Route path="/projectmanagement" element={<ProjectManagement />} />
          <Route path="/energy-report" element={<EnergyReport />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/user-info" element={<UserInfo />} />
        </Route>

        <Route element={<ProjectLayout />}>
          <Route
            path="/project/:id"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/electric" element={<Electric />} />
          <Route path="/electric/:nodeId" element={<ElectricDetail />} />
          <Route path="/water" element={<Water />} />
          <Route path="/water/:nodeId" element={<WaterDetail />} />
          <Route path="/compressed-air" element={<CompressedAir />} />
          <Route
            path="/compressed-air/:nodeId"
            element={<CompressedAirDetail />}
          />

          <Route path="/alarm-management" element={<Alarm_Project />} />
          <Route path="/report" element={<Report />} />
          <Route
            path="/settings"
            element={
              <Navigate to="/settings/emission-electricity" replace />
            }
          />
          <Route
            path="/settings/emission-electricity"
            element={<SystemSetting />}
          />
          <Route
            path="/settings/alarm-threshold"
            element={<Alarm_Project />}
          />
          <Route path="/project/:projectId" element={<EmptyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
