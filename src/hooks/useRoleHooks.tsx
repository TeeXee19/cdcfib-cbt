import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, deletRolee, list, permissions, update } from "../services/role.service";
import { showToast } from "../helpers/sweetAlert";
import { ICreateRole } from "../types/apiResponse";

export function useRoleListQuery(
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string
) {
  return useQuery({
    queryKey: ["role", page, size, search, sort, direction],
    queryFn: () => list(page, size, search, sort, direction),
  });
}
export function useRPermissionListQuery() {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissions(),
  });
}

// CREATE (mutation hook)
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      showToast("success", "Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// UPDATE (mutation hook)
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, roleId }: { payload: ICreateRole; roleId: string }) =>
      update(payload, roleId),
    onSuccess: () => {
      showToast("success", "Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}

// DELETE (mutation hook)
export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletRolee,
    onSuccess: () => {
      showToast("success", "Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: Error) => {
      showToast("error", error.message);
    },
  });
}
