import APIs from "../constants/APIs";
import { ICreateRole, PaginatedResponse, Role } from "../types/apiResponse";
import { sendRequest } from "./axios.service";

export async function list(
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "updatedAt",
    direction: string = "DESC"
): Promise<PaginatedResponse<Role>> {
    const result = await sendRequest(
        "GET",
        `${APIs.ROLE}`,
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
    return result.data;
}
export async function permissions(): Promise<Role[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.ROLE}/permissions`,
        "",
        true,
        {},
        { }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function create(payload:ICreateRole) {
  const result = await sendRequest("POST", `${APIs.ROLE}`, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function update(payload:ICreateRole, roleId:string) {
  const result = await sendRequest("PATCH", `${APIs.ROLE}/${roleId}`, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function deletRolee(roleId:string) {
  const result = await sendRequest("DELETE", `${APIs.ROLE}/${roleId}`,{});
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}