import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized globally or format error messages
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred";
    
    return Promise.reject({
      ...error,
      customMessage: message,
      statusCode: error.response?.status,
      errors: error.response?.data?.errors || [],
    });
  }
);
