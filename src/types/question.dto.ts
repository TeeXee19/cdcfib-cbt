export interface QuestionPayload {
  exam_id: number;
  question_type: "mcq" | "essay" | "boolean" | string;
  question_text: string;
  options?: string[];
  correct_answer?: string;
  marks: number;
  order?: number;
  status?: "active" | "inactive";
}
