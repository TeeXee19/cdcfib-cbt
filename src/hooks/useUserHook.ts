import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, list, update } from "../services/user.service";
import { InitiateRegistration } from "../types/auth.type";

export function useUserListQuery(
  page: number,
  size: number,
  search: string,
  sort: string,
  direction: string
) {
  return useQuery({
    queryKey: ["users", page, size, search, sort, direction],
    queryFn: () => list(page, size, search, sort, direction),
  });
}

type UseCreateUserOptions = {
  onSuccessCallback?: () => void;
};

export function useCreateUser({ onSuccessCallback }: UseCreateUserOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitiateRegistration) => create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (onSuccessCallback) {
        onSuccessCallback(); // e.g. reset form, hide modal
      }
    },
  });
}

// Hook for updating a user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, userId }: { payload: InitiateRegistration; userId: string }) =>
      update(payload, userId),
    onSuccess: () => {
      // invalidate or refetch user list after update
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}