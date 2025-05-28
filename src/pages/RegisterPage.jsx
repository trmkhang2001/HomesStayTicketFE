"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authApi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone_number: "",
    full_name: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi đăng ký");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors mb-6"
          >
            Homestay Vung Tau
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Đăng ký tài khoản
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              placeholder="tendangnhap"
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone_number"
              placeholder="0123456789"
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700">Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Đăng ký
          </button>

          <p className="text-sm text-center text-gray-600">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-gray-800 hover:underline font-medium"
            >
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
