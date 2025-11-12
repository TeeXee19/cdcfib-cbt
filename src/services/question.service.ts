import APIs from "../constants/APIs";
import { PaginatedResponse } from "../types/apiResponse";
import { QuestionPayload } from "../types/question.dto";
import { sendRequest } from "./axios.service";

/**
 * List all questions for a specific exam
 */
export async function list(
  examId: string,
  page: number = 1,
  size: number = 20,
  search: string = "",
  sort: string = "updated_at",
  direction: string = "DESC"
): Promise<PaginatedResponse<QuestionPayload>> {
  const result = await sendRequest(
    "GET",
    `${APIs.QUESTION}/exam/${examId}`,
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

  if (result?.statusCode !==  200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Create a new question
 */
export async function create(payload: QuestionPayload) {
  const result = await sendRequest("POST", `${APIs.QUESTION}`, payload);

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Get details of a single question
 */
export async function view(id: string) {
  const result = await sendRequest("GET", `${APIs.QUESTION}/${id}`, {});

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Update a question
 */
export async function update(id: string, payload: Partial<QuestionPayload>) {
  const result = await sendRequest("PATCH", `${APIs.QUESTION}/${id}`, payload);

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Delete a question
 */
export async function remove(id: string) {
  const result = await sendRequest("DELETE", `${APIs.QUESTION}/${id}`, {});

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}

/**
 * Bulk upload questions from file
 */
export async function bulkUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const result = await sendRequest("POST", `${APIs.QUESTION}/bulk-upload`, formData, true);

  if (result?.statusCode !== 200) {
    throw new Error(result?.data ?? result?.message);
  }

  return result.data;
}
