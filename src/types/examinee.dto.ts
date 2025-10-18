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


export interface QuestionPayload {
  id: number;
  exam_id: number;
  question_text: string;
  question_type: string; // e.g., 'single_choice', 'multiple_choice'
  options: string; // JSON string representing options, e.g., '{"A":"Apple","B":"Banana"}'
  marks: string; // e.g., "2.00"
  difficulty: "easy" | "medium" | "hard";
}

export interface ExamPayload {
  id: number;
  title: string;
  type: "Commissioned" | "Non-Commissioned";
  duration: number; // in minutes
  start_date: string; // ISO string
  end_date: string;   // ISO string
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  created_by: string | null;
  created_at: string;
  updated_at: string;
  questions: QuestionPayload[];
}

export interface ExamineeSessionPayload {
  id: string;
  last_name: string;
  first_name: string;
  nin: string;
  phone_number: string;
  candidate_number: string;
  centre_name: string;
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  last_sync: string | null;
  time_left: string; // time left in minutes as string
  candidate_type: "Commissioned" | "Non-Commissioned";
  created_at: string;
  updated_at: string;
}



