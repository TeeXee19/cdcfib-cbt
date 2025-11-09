import APIs from "../constants/APIs";
import { PaginatedResponse } from "../types/apiResponse";
import { Exam, ExamineePayload } from "../types/examinee.dto";
import { sendRequest, sendRequestCandiate } from "./axios.service";

/**
 * List all examinees
 */
export async function list(
  page: number = 1,
  size: number = 20,
  search: string = "",
  sort: string = "updated_at",
  direction: string = "DESC"
): Promise<PaginatedResponse<ExamineePayload>> {
  const result = await sendRequest(
    "GET",
    `${APIs.EXAMINEE}`,
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

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Get all examinees grouped by exam
 */
export async function listByExam(): Promise<ExamineePayload[]> {
  const result = await sendRequest("GET", `${APIs.EXAMINEE}/exam`, "", true);

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Create a new examinee
 */
export async function create(payload: ExamineePayload) {
  const result = await sendRequest("POST", `${APIs.EXAMINEE}`, payload);

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Upload examinees in bulk
 */
export async function upload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await sendRequest(
    "POST",
    `${APIs.EXAMINEE}/upload`,
    formData,
    true
  );

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Get a single examinee by ID
 */
export async function view(id: string) {
  const result = await sendRequest("GET", `${APIs.EXAMINEE}/${id}`, {});

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Update an examinee
 */
export async function update(id: string, payload: any) {
  const result = await sendRequest("POST", `${APIs.EXAMINEE}/${id}`, payload, true);

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Delete an examinee
 */
export async function remove(id: string) {
  const result = await sendRequest("DELETE", `${APIs.EXAMINEE}/${id}`, {});

  if (result?.status !== "success") {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}


export async function exam(): Promise<Exam> {
  const result = await sendRequestCandiate("GET", `exam-auth/questions`, {});

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

export async function submitExam(payload: any) {
  const result = await sendRequestCandiate("POST", `answer`, payload, false);

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;

}