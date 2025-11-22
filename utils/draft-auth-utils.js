// utils/authUtils.js
import axiosInstance from "./axiosInstance"; // preconfigured axios with baseURL & auth
import { getToken, saveToken, saveUser, removeToken, getCurrentUser } from "./localStorageUtils";

/**
 * Login user via API
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { user, token }
 */
export async function loginAccount(credentials) {
  try {
    const response = await axiosInstance.post("/user/login", credentials);
    const { data } = response;

    // Save token and user info
    if (data?.token && data?.user) {
      saveToken(data.token);
      saveUser(data.user);
    }

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

/**
 * Register new user via API
 * @param {Object} userData - { name, email, password, location }
 */
export async function createAccount(userData) {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    const { data } = response;

    if (data?.token && data?.user) {
      saveToken(data.token);
      saveUser(data.user);
    }

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

/**
 * Submit review via API
 * @param {Object} reviewData - { shopId, rating, content }
 */
export async function submitReview(reviewData) {
  try {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");

    const response = await axiosInstance.post("/reviews", reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

/**
 * Logout user
 */
export function logoutAccount() {
  removeToken();
}

/**
 * Helpers
 */
export { getToken, getCurrentUser, saveToken, saveUser };
