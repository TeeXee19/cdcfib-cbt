import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  create,
  list,
  update,
  view,
  remove,
  bulkUpload,
} from "../services/question.service";
import { showToast } from "../helpers/sweetAlert";
import { QuestionPayload } from "../types/question.dto";
import { PaginatedResponse } from "../types/apiResponse";

// 📄 LIST Questions for an Exam
export function useQuestionListQuery(
  examId: string,
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string
) {
  return useQuery<PaginatedResponse<QuestionPayload>>({
    queryKey: ["questions", examId, page, size, search, sort, direction],
    queryFn: () => list(examId, page, size, search, sort, direction),
    enabled: !!examId,
  });
}

// 🔍 VIEW Question Details
export function useQuestionViewQuery(id: string) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => view(id),
    enabled: !!id,
  });
}

// ➕ CREATE Question
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      showToast("success", "Question created successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// ✏️ UPDATE Question
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<QuestionPayload>;
    }) => update(id, payload),
    onSuccess: () => {
      showToast("success", "Question updated successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// 🗑️ DELETE Question
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      showToast("success", "Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// 📤 BULK UPLOAD Questions
export function useBulkUploadQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkUpload,
    onSuccess: () => {
      showToast("success", "Questions uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}
