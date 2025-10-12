import APIs from "../constants/APIs";
import { BorderPointData, MovementDirectionCount, MovementMonthlyCounts, ResidenceCountryStat } from "../types/apiResponse";
import { sendRequest } from "./axios.service";

export async function cardCounts(
): Promise<MovementDirectionCount[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.DASHBOARD}`,
        "",
        true,
        {},
        {
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function movementCounts(
    startDate?:any,
    endDate?: any
): Promise<MovementMonthlyCounts[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.DASHBOARD}/direction`,
        "",
        true,
        {},
        {
            startDate,
            endDate
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function movementBorderCount(
): Promise<BorderPointData[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.DASHBOARD}/direction/border`,
        "",
        true,
        {},
        {
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function nationalityCount(
): Promise<ResidenceCountryStat[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.DASHBOARD}/natianality`,
        "",
        true,
        {},
        {
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}