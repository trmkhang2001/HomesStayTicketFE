import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authApi";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // Thêm state để chứa thông báo lỗi
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Đặt lại thông báo lỗi trước khi gửi yêu cầu

    try {
      await login(formData);

      // Nếu đăng nhập thành công, chuyển hướng đến trang OTP
      navigate("/otp");
    } catch (err) {
      // Kiểm tra nếu tài khoản bị khóa
      if (err?.response?.data?.message === "Account is locked") {
        setErrorMessage("Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau.");
      } else {
        // Nếu không phải lỗi khóa tài khoản, hiển thị thông báo lỗi chung
        setErrorMessage(err?.response?.data?.message || "Lỗi đăng nhập");
      }
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
          <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
        </div>

        {/* Hiển thị thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="text-center text-red-500 mb-4 p-2 border border-red-500 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="#" className="hover:underline text-gray-800 font-medium">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Đăng nhập
          </button>

          <p className="text-sm text-center text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="/register"
              className="text-gray-800 hover:underline font-medium"
            >
              Đăng ký
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
