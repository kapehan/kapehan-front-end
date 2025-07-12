// This file will contain authentication-related utility functions
// In a real app, these would make API calls to your backend

/**
 * Login a user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - User data with token
 */
export async function loginAccount(credentials) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // This is a mock implementation - in a real app, this would be an API call
  // Example: return await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }).then(res => res.json());

  // For demo purposes, accept any email with a password longer than 5 chars
  if (!credentials.email.includes("@") || credentials.password.length < 6) {
    throw new Error("Invalid email or password")
  }

  // Generate a fake token
  const token = `token_${Math.random().toString(36).substring(2)}`

  // Return mock user data
  return {
    user: {
      id: "user_123",
      name: credentials.email.split("@")[0],
      email: credentials.email,
    },
    token,
  }
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - User data with token
 */
export async function createAccount(userData) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // This is a mock implementation - in a real app, this would be an API call
  // Example: return await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }).then(res => res.json());

  // Validate input
  if (!userData.name || !userData.email.includes("@") || userData.password.length < 6) {
    throw new Error("Invalid registration data")
  }

  // Generate a fake token
  const token = `token_${Math.random().toString(36).substring(2)}`

  // Return mock user data
  return {
    user: {
      id: `user_${Math.random().toString(36).substring(2)}`,
      name: userData.name,
      email: userData.email,
    },
    token,
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
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // This is a mock implementation - in a real app, this would be an API call
  // Example: return await fetch('/api/reviews', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${token}` },
  //   body: JSON.stringify(reviewData)
  // }).then(res => res.json());

  // Validate token
  if (!token || !token.startsWith("token_")) {
    throw new Error("Unauthorized")
  }

  // Validate review data
  if (!reviewData.shopId || !reviewData.rating || !reviewData.content) {
    throw new Error("Invalid review data")
  }

  // Return mock review data
  return {
    id: `review_${Math.random().toString(36).substring(2)}`,
    shopId: reviewData.shopId,
    rating: reviewData.rating,
    content: reviewData.content,
    date: new Date().toISOString(),
    user: {
      id: "user_123",
      name: "Current User",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  }
}

/**
 * Check if user is logged in by verifying token
 * @returns {boolean} - Whether user is logged in
 */
export function isLoggedIn() {
  // In a real app, this would check for a valid token in localStorage or cookies
  const token = localStorage.getItem("loginToken")
  return !!token
}

/**
 * Get the current user's token
 * @returns {string|null} - User token or null if not logged in
 */
export function getToken() {
  return localStorage.getItem("loginToken")
}

/**
 * Save token to localStorage
 * @param {string} token - Authentication token
 */
export function saveToken(token) {
  localStorage.setItem("loginToken", token)
}

/**
 * Remove token from localStorage (logout)
 */
export function removeToken() {
  localStorage.removeItem("loginToken")
}
