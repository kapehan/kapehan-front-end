import axiosInstance from "../utils/axiosInstance";

export const getCities = async () => {
  try {
    const response = await axiosInstance.get("/cities");
    return response.data.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getVibes = async () => {
  try {
    const response = await axiosInstance.get("/vibes");
    return response.data.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching vibes:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const getAmenities = async () => {
  try {
    const response = await axiosInstance.get("/amenities");
    return response.data.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching amenities:", error);
    throw error; // Re-throw the error for further handling
  }
};
