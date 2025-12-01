import axiosInstance from "./axiosInstance"; // preconfigured axios with baseURL & auth

/**
 * Login a user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - User data with token
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
    const response = await axiosInstance.post("/user/register", userData);
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
 * Get current user data
 * Fetches from backend using cookie
 */
export async function getCurrentUser() {
  try {
    const res = await axiosInstance.get("/user");
    return { ...(res.data || null) };
  } catch (err) {
    return null;
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    await axiosInstance.post("/user/logout"); // backend clears cookies
    return true;
  } catch (err) {
    return false;
  }
}

// 🔁 Refresh token silently (cookie-based)
export async function getNewAccessToken() {
  const res = await axiosInstance.post("/user/refreshToken");
  return res.data;
}
