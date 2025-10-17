export interface ExamPayload {
  title: string;
  description?: string;
  duration: number; // in minutes
  start_date: string; // ISO 8601 string (e.g., "2025-10-20T09:00:00Z")
  end_date: string;   // ISO 8601 string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}
