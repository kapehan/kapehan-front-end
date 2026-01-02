import axiosInstance from "../utils/axiosInstance";

// Create a review for a coffee shop (JSON payload)
export const createCoffeeShopReview = async (slug, data = {}) => {
  // data example: { rating: number, content: string }
  const response = await axiosInstance.post(`/review/${slug}/create`, data);
  return response.data;
};

// Get reviews by coffee shop slug
export const getCoffeeShopReviewsBySlug = async (slug, query = {}) => {
  console.log("this is the slug", slug);
  const response = await axiosInstance.get(`/reviews/${slug}`, {
    params: query,
  });
  console.log("response", response.data);
  return response.data;
};

export const deleteCoffeeShopReview = async (reviewId) => {
  if (!reviewId || typeof reviewId !== "string") throw new Error("reviewId is required");
  try {
    const { data } = await axiosInstance.post(`/review/${encodeURIComponent(reviewId)}/delete`);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error.message || "Delete failed";
    const err = new Error(msg);
    if (status) err.status = status;
    throw err;
  }
};

// Update existing review
export const updateCoffeeShopReview = async (
  slug,
  { coffee_shop_id, remarks, ratings } = {}
) => {
  if (!slug || typeof slug !== "string") throw new Error("slug is required");
  if (!coffee_shop_id) throw new Error("coffee_shop_id is required");
  const payload = {
    coffee_shop_id,
    remarks: remarks ?? "",
    ratings: ratings ?? null,
  };
  try {
    const { data } = await axiosInstance.post(
      `/review/${encodeURIComponent(slug)}/update`,
      payload
    );
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message || error.message || "Update failed";
    const err = new Error(msg);
    if (status) err.status = status;
    throw err;
  }
};

export const getReviewsByUser = async () => {
  try {
    const response = await axiosInstance.get("/user/reviews");
    return response.data.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching city counts:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getReviewsByUserId = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/reviews/${id}`);
    return response.data.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching city counts:", error);
    throw error; // Re-throw the error for further handling
  }
};
