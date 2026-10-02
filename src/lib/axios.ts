import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Helper to retrieve the current access token from localStorage or document.cookie
export const getStoredAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (local) return local;

    // Fallback to reading document cookie
    const match = document.cookie.match(/(?:^|;\s*)(?:accessToken|token)=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};

// Helper to retrieve the refresh token from localStorage or document.cookie
export const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const local = localStorage.getItem("refreshToken");
    if (local) return local;

    const match = document.cookie.match(/(?:^|;\s*)refreshToken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
};

// Helper to persist tokens across both localStorage and document.cookie
export const setStoredTokens = (accessToken?: string, refreshToken?: string) => {
  if (typeof window === "undefined") return;

  try {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; SameSite=Lax`;
      document.cookie = `token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
    }
  } catch (err) {
    console.warn("Could not save tokens to storage:", err);
  }
};

// Helper to purge all tokens from localStorage and cookies
export const clearStoredTokens = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
  } catch (err) {
    console.warn("Could not clear tokens:", err);
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Authorization Bearer token to all outgoing API requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Seamlessly refresh token on 401 Unauthorized and retry request
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Intercept 401 Unauthorized errors and attempt silent token refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStoredRefreshToken();

      // If no refresh token exists, purge session immediately
      if (!refreshToken) {
        clearStoredTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              "x-refresh-token": refreshToken,
            },
            withCredentials: true,
          }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.data?.token;
        const newRefreshToken =
          refreshResponse.data?.data?.refreshToken || refreshToken;

        if (newAccessToken) {
          setStoredTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
