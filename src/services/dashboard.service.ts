import APIs from "../constants/APIs";
import { DashboardResult } from "../types/apiResponse";
import { sendRequest } from "./axios.service";

export async function dashboard(date: string): Promise<DashboardResult> {
  const result = await sendRequest(
    "GET",
    `${APIs.DASHBOARD}?date=${date}`,
    "",
    true,
    {},
    {}
  );

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}
