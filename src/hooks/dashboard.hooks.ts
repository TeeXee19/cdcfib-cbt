import { useQuery } from "@tanstack/react-query";
import {  dashboard } from "../services/dashboard.service";

// 🔹 Dashboard card counts
export function useDashboardQuery() {
  return useQuery({
    queryKey: ["dashboard", "cardCounts"],
    queryFn: () => dashboard(),
  });
}