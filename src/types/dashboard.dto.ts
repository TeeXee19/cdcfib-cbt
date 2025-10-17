export interface ExamCount {
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
  total: number;
}

export interface ExamSummary {
  total_examinee: number;
  exam_counts: ExamCount[];
}
