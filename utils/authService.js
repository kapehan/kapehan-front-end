// src/api/authService.js
import axiosInstance from "./axiosInstance";

export const login = async (email, password) => {
  const res = await axiosInstance.post("/user/login", { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/user/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};

// 🔁 Refresh token silently (cookie-based)
export const getNewAccessToken = async () => {
  const res = await axiosInstance.post("/user/refreshToken");
  return res.data;
};
