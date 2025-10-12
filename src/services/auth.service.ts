import APIs from "../constants/APIs";
import { AuthData } from "../types/apiResponse";
import {
  ForgotPasswordType,
  LoginType,
  ResetPasswordType,
  SignupType,
  VerificationDto,
} from "../types/auth.type";
import { sendRequest } from "./axios.service";

export async function login(payload: LoginType) {
  // const response = await axiosApi.post(APIs.LOGIN, payload)
  const result = await sendRequest("POST", APIs.LOGIN, payload, false);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function signUp(payload: SignupType) {
  const result = await sendRequest("POST", APIs.SIGNUP, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function forgotPassword(payload: ForgotPasswordType) {
  const result = await sendRequest("POST", APIs.FORGOT_PASSWORD, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

export async function resetPassword(payload: ResetPasswordType) {
  const result = await sendRequest("POST", APIs.RESET_PASSWORD, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? "Invalid API response");
  }
  return result.data;
  // return await axiosApi.post(APIs.RESET_PASSWORD, payload)
}

export async function verifyEmail(token: string) {
  const result = await sendRequest("GET", `${APIs.ACTIVATE_ACCOUNT}/${token}`);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}
export async function verifyToken(payload:VerificationDto):Promise<AuthData> {
  const result = await sendRequest("POST", `${APIs.VERIFY_TOKEN}`, payload);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}
