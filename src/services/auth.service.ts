import APIs from "../constants/APIs";
// import { AuthData } from "../types/apiResponse";
import {
  ExamineeAccessPayload,
  LoginType,
} from "../types/auth.type";
import { sendRequest } from "./axios.service";

export async function login(payload: LoginType) {
  // const response = await axiosApi.post(APIs.LOGIN, payload)
  const result = await sendRequest("POST", `${APIs.LOGIN}/login`, payload, false);
  if (result?.status != 'success') {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}
export async function candidateLogin(payload: ExamineeAccessPayload) {
  // const response = await axiosApi.post(APIs.LOGIN, payload)
  const result = await sendRequest("POST", `${APIs.LOGIN}/examinee/login`, payload, false);
  if (result?.status != 'success') {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

