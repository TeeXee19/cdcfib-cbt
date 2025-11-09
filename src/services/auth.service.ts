import APIs from "../constants/APIs";
// import { ApiResponseType2 } from "../types/apiResponse";
// import { AuthData } from "../types/apiResponse";
import {
  // Candidate,
  ExamineeAccessPayload,
  LoginResponseType,
  LoginType,
} from "../types/auth.type";
import { sendRequest, sendRequestCandiate } from "./axios.service";

export async function login(payload: LoginType) {
  // const response = await axiosApi.post(APIs.LOGIN, payload)
  const result = await sendRequest("POST", `${APIs.LOGIN}/access`, payload, false);
  if (result?.status != 'success') {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}
export async function candidateLogin(payload: ExamineeAccessPayload):Promise<LoginResponseType> {
  // const response = await axiosApi.post(APIs.LOGIN, payload)
  const result = await sendRequestCandiate("POST", `exam-auth/login`, payload, false);
  if (result?.statusCode != 200) {
    throw new Error(result?.data ?? result?.message);
  }
  return result.data;
}

