/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosApi from "../config/ApiConfig";
import { ApiResponseType } from "../types/apiResponse";

export async function sendRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | 'PATCH',
  url: string,
  payload: any = null,
  isFormData: boolean = false,
  customHeaders: Record<string, string> = {},
  params: any = {},
): Promise<ApiResponseType | undefined> {
  return await axiosApi.request({
    method,
    url,
    data: payload ? (isFormData ? payload : JSON.stringify(payload)) : null,
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      ...customHeaders, // Merge custom headers
    },
    params: params ? params : null,
  });
}
