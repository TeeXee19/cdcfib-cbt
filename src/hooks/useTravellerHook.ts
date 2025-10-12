import { useQuery } from "@tanstack/react-query";
import { list, passport, personMovements, travelHistory } from "../services/traveller.service";

export function useTravellerListQuery(
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string,
  startDate?: any,
  endDate?:any
) {
  return useQuery({
    queryKey: ["users", page, size, search, sort, direction, startDate, endDate],
    queryFn: () => list(page, size, search, sort, direction, startDate, endDate),
  });
}
export function useTravellerTravelHistoryQuery(
  personId:string,
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string,
  startDate?: any,
  endDate?:any
) {
  return useQuery({
    queryKey: ["travelHistory", personId, page, size, search, sort, direction, startDate, endDate],
    queryFn: () => travelHistory(personId, page, size, search, sort, direction, startDate, endDate),
  });
}

export function usePassportQuery(
  personId: string,
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string,
  startDate?: any,
  endDate?: any
) {
  return useQuery({
    queryKey: [
      "passport",
      personId,
      page,
      size,
      search,
      sort,
      direction,
      startDate,
      endDate,
    ],
    queryFn: () =>
      passport(personId, page, size, search, sort, direction, startDate, endDate),
    enabled: !!personId, // don't fetch until we have a personId
  });
}

export function usePersonMovementsQuery(personId: string) {
  return useQuery({
    queryKey: ["movements", personId],
    queryFn: () => personMovements(personId),
    enabled: !!personId,
  });
}
