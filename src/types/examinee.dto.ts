export interface ExamineePayload {
    id: number;
    last_name: string;
    first_name: string;
    nin: string;
    phone_number: string;
    candidate_number: string;
    time_left: number;
    centre_name: string;
    candidate_type: "Commissioned" | "Non-Commissioned";
    status: "scheduled" | "active" | "completed" | string;
    created_at: string;
    updated_at: string;
}


