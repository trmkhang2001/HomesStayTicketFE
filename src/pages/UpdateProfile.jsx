import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/authApi";
import NotificationModal from "../components/NotificationModal";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    username: "",
    email: "",
  });
  const [notify, setNotify] = useState({ show: false, message: "", type: "" });

  // Lấy thông tin người dùng khi trang được tải
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile(); // Gọi API getProfile
        setFormData({
          full_name: response.user.full_name || "",
          phone_number: response.user.phone_number || "",
          username: response.user.username || "", // Đưa username vào formData
          email: response.user.email || "", // Đưa email vào formData
        });
      } catch (err) {
        setNotify({
          show: true,
          message: "Không thể tải thông tin người dùng!",
          type: "error",
        });
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(formData); // Cập nhật profile
      setNotify({
        show: true,
        message: "Cập nhật thành công!",
        type: "success",
      });
    } catch (err) {
      setNotify({
        show: true,
        message: "Lỗi khi cập nhật thông tin!",
        type: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="" style={{ minHeight: "60vh" }}>
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            👤 Cập nhật thông tin cá nhân
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hiển thị username và email nhưng không cho phép chỉnh sửa */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled // Không cho chỉnh sửa
                className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled // Không cho chỉnh sửa
                className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
              />
            </div>

            {/* Các trường có thể chỉnh sửa */}
            <div className="space-y-2">
              <label
                htmlFor="full_name"
                className="block text-sm font-semibold"
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                placeholder="Tên của bạn"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone_number"
                className="block text-sm font-semibold"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                placeholder="Số điện thoại"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </form>

          {notify.show && (
            <NotificationModal
              message={notify.message}
              type={notify.type}
              onClose={() => setNotify({ ...notify, show: false })}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
