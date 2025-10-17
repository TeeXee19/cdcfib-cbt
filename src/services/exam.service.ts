import APIs from "../constants/APIs";
import { PaginatedResponse } from "../types/apiResponse";
import { ExamPayload } from "../types/exam.dto";
import { sendRequest } from "./axios.service";

export async function list(
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "updatedAt",
    direction: string = "DESC"
): Promise<PaginatedResponse<ExamPayload>> {
    const result = await sendRequest(
        "GET",
        `${APIs.EXAM}`,
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

export async function create(payload: ExamPayload) {
    const result = await sendRequest("POST", `${APIs.EXAM}`, payload);
    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function update(payload: ExamPayload, id: string) {
    const result = await sendRequest("PATCH", `${APIs.EXAM}/${id}`, payload);
    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function view(id: string) {
    const result = await sendRequest("GET", `${APIs.EXAM}/${id}`, {});
    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function deletRolee(roleId: string) {
    const result = await sendRequest("DELETE", `${APIs.EXAM}/${roleId}`, {});
    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}