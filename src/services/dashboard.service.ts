import APIs from "../constants/APIs";
import { ExamSummary } from "../types/dashboard.dto";
import { sendRequest } from "./axios.service";

export async function dashboard(
): Promise<ExamSummary> {
    const result = await sendRequest(
        "GET",
        `${APIs.DASHBOARD}`,
        "",
        true,
        {},
        {
        }
    );

    if (result?.status != 'success') {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}