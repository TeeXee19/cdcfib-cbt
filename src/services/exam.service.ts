import APIs from "../constants/APIs";
// import { PaginatedResponse } from "../types/apiResponse";
import {  ExamResponse } from "../types/exam.dto";
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

export async function create(payload:any) {
    const result = await sendRequest("POST", `${APIs.EXAM}`, payload, true);
    if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function update(payload: any, id: number) {
    const result = await sendRequest("POST", `${APIs.EXAM}/${id}`, payload, true);
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

export async function deletRExam(examId: number) {
    const result = await sendRequest("DELETE", `${APIs.EXAM}/${examId}`, {});
    if (result?.status !== 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}