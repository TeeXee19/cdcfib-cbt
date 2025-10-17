export interface ExamPayload {
  title: string;
  description?: string;
  duration: number; // in minutes
  start_date: string; // ISO 8601 string (e.g., "2025-10-20T09:00:00Z")
  end_date: string;   // ISO 8601 string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Exam {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  start_date: string; // ISO timestamp
  end_date: string; // ISO timestamp
  status: "scheduled" | "active" | "completed" | string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  creator: string | null;
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

