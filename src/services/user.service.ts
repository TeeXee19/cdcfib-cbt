import APIs from "../constants/APIs";
import {
    UserItem
} from "../types/apiResponse";
import { InitiateRegistration } from "../types/auth.type";
import { sendRequest } from "./axios.service";

export async function list(
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "updatedAt",
    direction: string = "DESC"
): Promise<UserItem[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.USER}/list`,
        "",
        true,
        {},
        {
            size: size,
            search: search,
            sort: sort,
            direction: direction,
            page: page, // API is 0-based
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data.items;
}

export async function create(payload:InitiateRegistration) {
  const result = await sendRequest("POST", `${APIs.USER}`, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function update(payload:InitiateRegistration, userId:string) {
  const result = await sendRequest("PATCH", `${APIs.USER}/${userId}`, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}