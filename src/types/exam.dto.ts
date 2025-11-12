export interface ExamPayload {
  title: string;
  type?: string;
  duration: number; // in minutes
  start_date: string; // ISO 8601 string (e.g., "2025-10-20T09:00:00Z")
  end_date: string;   // ISO 8601 string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  question_file:any
}

export interface ExamTime {
  id: number;
  exam_id: number;
  start_time: string;   // e.g. "2025-10-19 21:12:43"
  end_time: string | null;  // can be null if still active
  status: string;       // e.g. "active", "completed"
  created_at: string;   // ISO datetime string
  updated_at: string;   // ISO datetime string
}


export interface Exam {
  id: number;
  title: string;
  type: string | null;
  duration: number;
  start_date: string; // ISO timestamp
  end_date: string; // ISO timestamp
  status: "scheduled" | "active" | "completed" | string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  creator: string | null;
  exam_times:ExamTime[]
}

export interface ExamMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ExamResponse {
  data: Exam[];
  meta: ExamMeta;
}



