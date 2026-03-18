export interface BarQuestion {
  id: string;
  subject: string;
  sub_topic: string;
  year: number;
  bar_chair: string;
  question_text: string;
  suggested_answer: string;
}

export type View = 'subjects' | 'sub-topics' | 'questions' | 'yearly';

export interface Subject {
  name: string;
  icon: string;
  description: string;
}
