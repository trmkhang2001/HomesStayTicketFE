"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verify2FA } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function OTPPage() {
  const [otp, setOtp] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verify2FA(otp);
      const { user } = res;
      login({
        authenticated: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
      });
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi xác thực OTP");
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
          <h2 className="text-2xl font-bold text-gray-800">Xác thực OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Vui lòng nhập mã OTP đã gửi đến email của bạn để xác thực tài khoản.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-700">Mã OTP</label>
            <input
              type="text"
              placeholder="Nhập mã OTP của bạn"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Xác nhận
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Không nhận được mã?{" "}
              <button
                type="button"
                className="text-gray-800 hover:underline font-medium"
              >
                Gửi lại mã
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
