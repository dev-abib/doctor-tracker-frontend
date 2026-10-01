import { apiClient } from "@/lib/axios";
import { ApiResponse, DashboardStats } from "@/types/api";

export const dashboardApi = {
  getStats: async (timeframe: "day" | "week" | "month" = "day"): Promise<DashboardStats> => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats", {
      params: { timeframe },
    });
    return res.data.data!;
  },
};
