"use client";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Tổng quan", path: "/admin/dashboard" },
  { name: "Quản Chi Nhánh", path: "/admin/branch" },
  { name: "Quản Lý Phòng", path: "/admin/room" },
  // { name: "Quản Khách Hàng", path: "/admin/customers" },
  { name: "Quản Đặt Phòng", path: "/admin/booking" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="bg-gray-200 text-gray-800 w-64 h-screen fixed top-0 left-0 flex flex-col justify-between p-6 shadow-sm border-r border-gray-200 z-50">
      {/* Logo + Tiêu đề */}
      <div>
        <a
          href="/"
          className="text-2xl font-bold text-center mb-8 tracking-wide text-gray-800 cursor-pointer hover:text-gray-600 transition-colors"
        >
          Home
        </a>

        {/* Danh sách nav */}
        <nav className="flex flex-col space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Thông tin người dùng + Logout */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
            {user?.user.username
              ? user.user.username.charAt(0).toUpperCase()
              : "U"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {user?.user.username || "Người dùng"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.user.role || "Quản trị viên"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full mt-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
