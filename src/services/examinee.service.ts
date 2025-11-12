import APIs from "../constants/APIs";
import { PaginatedResponse } from "../types/apiResponse";
import { ExamineePayload, ExamPayload } from "../types/examinee.dto";
import { sendRequest } from "./axios.service";

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

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Get all examinees grouped by exam
 */
export async function listByExam(): Promise<ExamineePayload[]> {
  const result = await sendRequest("GET", `${APIs.EXAMINEE}/exam`, "", true);

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Create a new examinee
 */
export async function create(payload: ExamineePayload) {
  const result = await sendRequest("POST", `${APIs.EXAMINEE}`, payload);

  if (result?.statusCode != 200) {
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

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Get a single examinee by ID
 */
export async function view(id: string) {
  const result = await sendRequest("GET", `${APIs.EXAMINEE}/${id}`, {});

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Update an examinee
 */
export async function update(id: string, payload: any) {
  const result = await sendRequest("POST", `${APIs.EXAMINEE}/${id}`, payload, true);

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Delete an examinee
 */
export async function remove(id: string) {
  const result = await sendRequest("DELETE", `${APIs.EXAMINEE}/${id}`, {});

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}


export async function exam(): Promise<ExamPayload> {
  const result = await sendRequest("GET", `${APIs.EXAMINEE}/exam`, {});

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

export async function submitExam(payload: any) {
  const result = await sendRequest("POST", `answers`, payload, false);

  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;

}