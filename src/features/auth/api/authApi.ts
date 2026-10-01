import { apiClient } from "@/lib/axios";
import { ApiResponse, User } from "@/types/api";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>(
      "/auth/login",
      credentials
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
};
