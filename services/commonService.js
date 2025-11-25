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

// Updated: accept payload and POST to /user/anon
export const getAnonLocation = async (payload) => {
  try {
    // payload expected: { latitude: number, longitude: number }
    console.log("commonService.getAnonLocation payload:", payload); // <-- added
    // only send lat/long to backend (no city)
    const body = { latitude: payload.latitude, longitude: payload.longitude };
    const response = await axiosInstance.post("/user/location", body);
    console.log("commonService.getAnonLocation response:", {
      status: response?.status,
      data: response?.data?.data ?? response?.data,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error posting anonymous location:", error);
    throw error;
  }
};