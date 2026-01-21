// src/api/axiosInstance.js
import axios from "axios";
import { getNewAccessToken } from "./auth-utils";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/v1",
  withCredentials: true,
  timeout: 10000,
});

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If there's no response (network issue, timeout)
    if (!error.response) {
      console.error("[AXIOS ERROR] Network/Timeout:", error.message);
      return Promise.reject(error);
    }

    const status = error.response.status;
    console.groupCollapsed(`[AXIOS ERROR] ${status} on ${originalRequest.url}`);
    console.error("Error message:", error.message);
    console.error("Response data:", error.response?.data);
    console.error("Original request:", originalRequest);
    console.groupEnd();

    // 🧠 Only handle 401 errors (unauthorized)
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/refreshToken")
    ) {
      if (isRefreshing) {
        console.log("[AXIOS] Token refresh in progress, queuing request...");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("[AXIOS] Attempting to refresh access token...");
        await getNewAccessToken(); // Silent refresh via cookie/session

        console.log("[AXIOS] Token refreshed successfully. Retrying requests...");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("[AXIOS] Token refresh failed:", refreshError.message);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 🧱 Handle 403 or other errors normally
    if (status === 403) {
      console.warn("[AXIOS] Access forbidden (403):", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
