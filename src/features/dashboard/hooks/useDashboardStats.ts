import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboardApi";

export const useDashboardStats = (timeframe: "day" | "week" | "month" = "day") => {
  return useQuery({
    queryKey: ["dashboard", "stats", timeframe],
    queryFn: () => dashboardApi.getStats(timeframe),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
