import axiosInstance from "../utils/axiosInstance";

export const createCoffeeShop = async (data = {}) => {
  try {
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Data must be a plain object");
    }
    const response = await axiosInstance.post("/shop/create", data); // JSON body
    return response.data;
  } catch (error) {
    console.error("Error creating coffee shop:", error);
    throw error;
  }
};

export const getAllCoffeeShop = async (query = {}) => {
  try {
    const response = await axiosInstance.get("/shops", { params: query });
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
};

export const getCoffeeShopById = async (slug) => {
  try {
    const response = await axiosInstance.get(`/shop/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
};

export const getMenuByCoffeeShopId = async (slug) => {
  try {
    const response = await axiosInstance.get(`/shop/menu/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    throw error;
  }
};