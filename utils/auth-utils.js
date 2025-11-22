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
 * Submit a review for a coffee shop
 * @param {Object} reviewData - Review data
 * @param {string} reviewData.shopId - ID of the coffee shop
 * @param {number} reviewData.rating - Rating (1-5)
 * @param {string} reviewData.content - Review content
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Submitted review data
 */
export async function submitReview(reviewData, token) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This is a mock implementation - in a real app, this would be an API call
  // Example: return await fetch('/api/reviews', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${token}` },
  //   body: JSON.stringify(reviewData)
  // }).then(res => res.json());

  // Validate token
  if (!token || !token.startsWith("token_")) {
    throw new Error("Unauthorized");
  }

  // Validate review data
  if (!reviewData.shopId || !reviewData.rating || !reviewData.content) {
    throw new Error("Invalid review data");
  }

  const user = getCurrentUser();

  // Return mock review data
  return {
    id: `review_${Math.random().toString(36).substring(2)}`,
    shopId: reviewData.shopId,
    rating: reviewData.rating,
    content: reviewData.content,
    date: new Date().toISOString(),
    user: {
      id: user?.id || "user_123",
      name: user?.name || "Current User",
      avatar: user?.avatar || "/placeholder.svg?height=50&width=50",
    },
  };
}

/**
 * Get current user data
 * Fetches from backend using cookie
 */
export async function getCurrentUser() {
  try {
    const res = await axiosInstance.get("/user");
    return {...res.data || null};
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

/**
 * Add a visited coffee shop to user's history
 * @param {Object} shop - Coffee shop data
 */
export function addVisitedShop(shop) {
  if (typeof window === "undefined") return;

  const user = getCurrentUser();
  if (!user) return;

  const visitedShops = user.visitedShops || [];

  // Remove if already exists to avoid duplicates
  const filteredShops = visitedShops.filter((s) => s.id !== shop.id);

  // Add to beginning of array
  const updatedShops = [
    {
      id: shop.id,
      name: shop.name,
      image: shop.image,
      city: shop.city,
      rating: shop.rating,
      visitedAt: new Date().toISOString(),
    },
    ...filteredShops,
  ].slice(0, 10); // Keep only last 10 visited

  const updatedUser = {
    ...user,
    visitedShops: updatedShops,
  };

  saveUser(updatedUser);
}
