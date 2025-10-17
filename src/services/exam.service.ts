import APIs from "../constants/APIs";
// import { PaginatedResponse } from "../types/apiResponse";
import { ExamPayload, ExamResponse } from "../types/exam.dto";
import { sendRequest } from "./axios.service";

export async function list(
  page: number = 1,
  size: number = 20,
  search: string = "",
  sort: string = "id",
  direction: string = "DESC"
): Promise<ExamResponse> {
  const result = await sendRequest(
    "GET",
    `${APIs.EXAM}`,
    "",
    true,
    {},
    {
      size,
      search,
      sort,
      direction,
      page,
    }
  );

  if (result?.status !== 'success') {
      throw new Error(result?.data ?? result?.message);
    }
    
    console.log('loaded exams', result)
  // ✅ Return the `ExamResponse` payload

  return result.data;
}

export async function create(payload: ExamPayload) {
    const result = await sendRequest("POST", `${APIs.EXAM}`, payload);
    if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function update(payload: ExamPayload, id: string) {
    const result = await sendRequest("PATCH", `${APIs.EXAM}/${id}`, payload);
   if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}
export async function view(id: string) {
    const result = await sendRequest("GET", `${APIs.EXAM}/${id}`, {});
    if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function deletRolee(roleId: string) {
    const result = await sendRequest("DELETE", `${APIs.EXAM}/${roleId}`, {});
    if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}