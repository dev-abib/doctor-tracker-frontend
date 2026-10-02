import { apiClient } from "@/lib/axios";
import { ApiResponse, User } from "@/types/api";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
  token?: string;
}

export interface RefreshResponseData {
  user?: User;
  accessToken: string;
  refreshToken: string;
  token?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      credentials
    );
    return res.data.data!;
  },

  refreshToken: async (token?: string): Promise<RefreshResponseData> => {
    const res = await apiClient.post<ApiResponse<RefreshResponseData>>(
      "/auth/refresh-token",
      token ? { refreshToken: token } : {},
      token ? { headers: { "x-refresh-token": token } } : undefined
    );
    return res.data.data!;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
    return res.data.data!.user;
  },

  updateProfile: async (payload: UpdateProfilePayload | FormData): Promise<User> => {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const res = await apiClient.patch<ApiResponse<{ user: User }>>(
      "/auth/profile",
      payload,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    );
    return res.data.data!.user;
  },

  updatePassword: async (payload: UpdatePasswordPayload): Promise<string> => {
    const res = await apiClient.patch<ApiResponse<null>>(
      "/auth/password",
      payload
    );
    return res.data.message || "Password updated successfully";
  },

  uploadImage: async (file: File, folder = "general"): Promise<{ url: string; public_id?: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post<ApiResponse<{ url: string; public_id: string }>>(
      `/upload?folder=${encodeURIComponent(folder)}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data!;
  },
};
