import { useQuery } from "@tanstack/react-query";
import { dashboard } from "../services/dashboard.service";

// 🔹 Dashboard card counts
export function useDashboardQuery(date: string) {
  return useQuery({
    queryKey: ["dashboard", "cardCounts"],
    queryFn: () => dashboard(date),
    enabled: !!date,
    refetchInterval: 30000, // refetch every 5 seconds
  });
}
