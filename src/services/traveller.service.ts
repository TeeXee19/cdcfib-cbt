import APIs from "../constants/APIs";
import { MovementDirectionCount } from "../types/apiResponse";
// import {
//     UserItem
// } from "../types/apiResponse";
import { PaginatedResponse2, Person, TravelHistory, Traveller } from "../types/traveller.dto";
import { sendRequest } from "./axios.service";

export async function list(
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "updatedAt",
    direction: string = "DESC",
    startDate?: any,
    endDate?: any
): Promise<PaginatedResponse2<Person>> {
    const result = await sendRequest(
        "GET",
        `${APIs.TRAVELLER}`,
        "",
        true,
        {},
        {
            size: size,
            search: search,
            sort: sort,
            direction: direction,
            page: page, // API is 0-based
            startDate: startDate,
            endDate
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function passport(
    personId: string,
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "updatedAt",
    direction: string = "DESC",
    startDate?: any,
    endDate?: any
): Promise<PaginatedResponse2<Traveller>> {
    const result = await sendRequest(
        "GET",
        `${APIs.TRAVELLER}/passport/${personId}`,
        "",
        true,
        {},
        {
            size: size,
            search: search,
            sort: sort,
            direction: direction,
            page: page, // API is 0-based
            startDate: startDate,
            endDate
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function personMovements(
    personId: string
): Promise<MovementDirectionCount[]> {
    const result = await sendRequest(
        "GET",
        `${APIs.TRAVELLER}/movement/${personId}`,
        "",
        true,
        {},
        {}
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

export async function travelHistory(
    personId: string,
    page: number = 1,
    size: number = 20,
    search: string,
    sort: string = "DocumentIssueDate",
    direction: string = "DESC",
    startDate?: any,
    endDate?: any
): Promise<PaginatedResponse2<TravelHistory>> {
    const result = await sendRequest(
        "GET",
        `${APIs.TRAVELLER}/travel-history/${personId}`,
        "",
        true,
        {},
        {
            size: size,
            search: search,
            sort: sort,
            direction: direction,
            page: page, // API is 0-based
            startDate: startDate,
            endDate
        }
    );

    if (result?.statusCode != 200) {
        throw new Error(result?.data ?? result?.message);
    }
    return result.data;
}

