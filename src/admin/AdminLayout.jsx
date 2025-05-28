import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <div className="ml-64 p-6 overflow-y-auto min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
