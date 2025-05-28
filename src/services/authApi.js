// src/api/authApi.js
import api from './axios';

// Đăng ký người dùng mới
export const register = async ({ username, email, phone_number, password, full_name }) => {
  const res = await api.post('/users/register', {
    username,
    email,
    phone_number,
    password,
    full_name,
  });
  return res.data;
};

// Đăng nhập: Gửi username + password, nhận OTP qua email
export const login = async ({ username, password }) => {
  const res = await api.post('/users/login', { username, password }, { withCredentials: true });
  return res.data;
};

// Xác thực OTP: Trả về JWT token
export const verify2FA = async (otp) => {
  const res = await api.post('/users/verify2FA', { otp }, { withCredentials: true });
  return res.data;
};

// (Không thấy logout và update profile trong backend bạn gửi, nên mình để trống hoặc tạm ẩn)
export const logout = async () => {
  // Tùy vào BE, có thể clear cookie/tokens
  const res = await api.post('/users/logout');
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};
export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
}
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};
