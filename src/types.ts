export type PriorityType = 'high' | 'medium' | 'low';
export type StatusType = 'todo' | 'in_progress' | 'completed';
export type NoteCategoryType = 'summary' | 'formula' | 'memorization' | 'class_note';

export interface Schedule {
  id: string;
  subjectName: string;
  day: string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "09:30"
  notes?: string;
  color: string; // Tailwind hex or name class, e.g. "#FFB4C2" (soft coquette pink)
}

export interface Assignment {
  id: string;
  title: string;
  subjectName: string;
  dueDate: string; // YYYY-MM-DD
  priority: PriorityType;
  status: StatusType;
}

export interface Exam {
  id: string;
  title: string;
  subjectName: string;
  date: string; // YYYY-MM-DD
  targetGrade: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface Subject {
  id: string;
  name: string;
  color: string; // e.g., "#FFDEE9"
  progress: number; // 0-100
  lastGrade?: number;
}

export interface Grade {
  id: string;
  subjectName: string;
  title: string; // exam/homework title
  score: number; // e.g., 95
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  history: Record<string, boolean>; // e.g. { "2026-06-08": true }
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategoryType;
  updatedAt: string;
}

export interface StudyStats {
  weeklyHours: number[]; // Monday to Sunday
  totalSessions: number;
  totalFocusTime: number; // in minutes
}
