import { useQuery } from "@tanstack/react-query";
import { cardCounts, movementCounts, movementBorderCount, nationalityCount } from "../services/dashboard.service";

// 🔹 Dashboard card counts
export function useCardCountsQuery() {
  return useQuery({
    queryKey: ["dashboard", "cardCounts"],
    queryFn: () => cardCounts(),
  });
}

// 🔹 Movement counts
export function useMovementCountsQuery(
  startDate?:any,
  endDate?: any
) {
  return useQuery({
    queryKey: ["dashboard", "movementCounts", startDate, endDate],
    queryFn: () => movementCounts(startDate, endDate),
    
  });
}

// 🔹 Movement direction counts (border points + directions)
export function useMovementBorderCountQuery() {
  return useQuery({
    queryKey: ["dashboard", "movementDirectionCount"],
    queryFn: () => movementBorderCount(),
  });
}
export function useNationalityountQuery() {
  return useQuery({
    queryKey: ["dashboard", "nationalityCount"],
    queryFn: () => nationalityCount(),
  });
}
