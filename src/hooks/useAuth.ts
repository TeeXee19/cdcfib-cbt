/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  resetPassword,
  signUp,
  verifyEmail,
  verifyToken,
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
      if (data.secret && data.data) {
          navigate('/mfa', { state: { 
          data: data.data,
          secret: data.secret,
          username: variables.username } })
        return;
      }
      // else if (data.secret) {
      //   navigate('/mfa', { state: { 
      //     data: data.data,
      //     secret: data.secret,
      //     username: variables.username } })
      // }
      navigate('/otp', {
        state: {
          token: data.token,
          username: variables.username
        }
      })

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

export function useSignUpMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (_data, _variables) => {
      // console.log(_variables);
      setItem("email", _variables.email);
      // alert(_data);
      navigate('/account/verify', {
        state: {
          email: _variables.email,
          nextPath: '/login'
        }
      })
      showToast('success', "User added successfully. Please check your email for verification");
    },
    onError: (error: Error) => {
      showToast('error', error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] }).catch(() => { });
    },
  });
}

export function useVerifyTokenMutation({ path }: Props) {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyToken,
    onSuccess: (_data, _variables) => {
      // setItem("email", _variables.email);
      // alert(_data);
      if(_data.accessToken){
        setItem('token', _data.accessToken)
        showToast('success', "User login successfully");
      }
      if(_data.userInfo){
        setItem('user', JSON.stringify(_data.userInfo))
      }

      navigate(path, {
        state: _variables
      });
    },
    onError: (error: Error) => {
      showToast('error', error.message)
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["services"] }).catch(() => {});
    },
  });
}

export function useAccountVerifyQuery(token: string) {
  return useQuery({
    queryKey: ["verifyAccount"],
    queryFn: () => verifyEmail(token),
  });
}

export function useForgotPasswordMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_data, variables) => {
      // showToast('success', _data.message)
      navigate('/account/verify', {
        state: {
          username: variables.username,
          token: _data.token,
          nextPath: '/reset-password'
        }
      })
      showToast('success', `Otp sent to ${variables.username}`);
    },
    onError: (_data) => {
      showToast('error', _data.message)
      // customToast.error(`${_data.message}`);
    },
    onSettled: () => {
      queryClient
        .invalidateQueries({ queryKey: ["forgotPassword"] })
        .catch(() => { });
    },
  });
}

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (_data, variables) => {
      showToast('success', "Password reset successfully");
      navigate('/', {
        state: {
          email: variables.email
        }
      })
    },
    onError: (_error) => {
      showToast('error', _error.message)
    },
    onSettled: () => {
      queryClient
        .invalidateQueries({ queryKey: ["resetPassword"] })
        .catch(() => { });
    },
  });
}
