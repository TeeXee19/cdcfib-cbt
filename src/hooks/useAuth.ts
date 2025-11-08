/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  candidateLogin,
  login,

} from "../services/auth.service";
// import { customToast } from "../helpers/toast";
import { setItem } from "../helpers/storage";
import { useNavigate } from "react-router-dom";
import { showToast } from "../helpers/sweetAlert";

export interface Props {
  path: string;
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data, variables) => {
      if (data.accessToken) {
        setItem('token', data.accessToken)
        showToast('success', "User login successfully");
      }
      if (data.user) {
        setItem('user', data.user)
      }
      navigate('/dashboard', {
        state: variables
      });
    },
    onError: (error: Error) => {
      console.log(error);
      // customToast.error(error.message);
      showToast('error', error.message)
      // alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }).catch(() => { });
    },
  });
}
export function useCandidateLoginMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateLogin,
    onSuccess: (data, variables) => {
      if (data.accessToken) {
        setItem('token', data.accessToken)
        showToast('success', "User login successfully");
      }
      if (data.examinee) {
        setItem('examinee', data.examinee)
      }
      navigate('/waiting', {
        state: variables
      });
    },
    onError: (error: Error) => {
      console.log(error);
      // customToast.error(error.message);
      showToast('error', error.message)
      // alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }).catch(() => { });
    },
  });
}

