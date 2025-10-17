import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, list, update, view, deletRolee } from "../services/exam.service";
import { showToast } from "../helpers/sweetAlert";
import { ExamPayload, ExamResponse } from "../types/exam.dto";
// import { PaginatedResponse } from "../types/apiResponse";

// 📄 LIST Exams
export function useExamListQuery(
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string
) {
  return useQuery<ExamResponse>({
    queryKey: ["exams", page, size, search, sort, direction],
    queryFn: () => list(page, size, search, sort, direction),
  });
}

// 🔍 VIEW Exam Details
export function useExamViewQuery(id: string) {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: () => view(id),
    enabled: !!id,
  });
}

// ➕ CREATE Exam
export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      showToast("success", "Exam created successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// ✏️ UPDATE Exam
export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExamPayload }) =>
      update(payload, id),
    onSuccess: () => {
      showToast("success", "Exam updated successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// 🗑️ DELETE Exam
export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletRolee,
    onSuccess: () => {
      showToast("success", "Exam deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}
