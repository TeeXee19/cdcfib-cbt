import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  list,
  listByExam,
  create,
  upload,
  view,
  update,
  remove,
  exam,
} from "../services/examinee.service";
import { showToast } from "../helpers/sweetAlert";
import { ExamineePayload } from "../types/examinee.dto";
import { PaginatedResponse } from "../types/apiResponse";

/**
 * 📋 LIST Examinees
 */
export function useExamineeListQuery(
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string
) {
  return useQuery<PaginatedResponse<ExamineePayload>>({
    queryKey: ["examinees", page, size, search, sort, direction],
    queryFn: () => list(page, size, search, sort, direction),
  });
}

/**
 * 📚 LIST Examinees grouped by Exam
 */
export function useExamineeByExamQuery() {
  return useQuery<ExamineePayload[]>({
    queryKey: ["examinees", "by-exam"],
    queryFn: () => listByExam(),
  });
}

/**
 * 🔍 VIEW single Examinee details
 */
export function useExamineeViewQuery(id: string) {
  return useQuery({
    queryKey: ["examinee", id],
    queryFn: () => view(id),
    enabled: !!id,
  });
}


export function useExamineeExamQuery(id: string) {
  return useQuery({
    queryKey: ["examineeExam", id],
    queryFn: () => exam(), // pass the id to your exam fetch function
    // enabled: enabled,
  });
}


/**
 * ➕ CREATE Examinee
 */
export function useCreateExaminee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      showToast("success", "Examinee created successfully");
      queryClient.invalidateQueries({ queryKey: ["examinees"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

/**
 * ✏️ UPDATE Examinee
 */
export function useUpdateExaminee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ExamineePayload>;
    }) => update(id, payload),
    onSuccess: () => {
      showToast("success", "Examinee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["examinees"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

/**
 * 🗑️ DELETE Examinee
 */
export function useDeleteExaminee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      showToast("success", "Examinee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["examinees"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

/**
 * 📤 BULK UPLOAD Examinees
 */
export function useBulkUploadExaminee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upload,
    onSuccess: () => {
      showToast("success", "Examinees uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["examinees"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}
