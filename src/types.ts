export type StudentStatus = 'Active' | 'Lead' | 'Inactive';
export type FollowUpStatus = 'overdue' | 'today' | 'caught-up' | 'none';

export interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  course: string;
  schedule: string;
  teacher: string;
  status: StudentStatus;
  nextFollowUp: string;
  followUpStatus: FollowUpStatus;
  attendance: number;
  avatarColor: string;
}

export interface ClassNote {
  id: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  understanding: 'Excellent' | 'Good Understanding' | 'Needs Practice' | 'Struggling';
  covered: string;
  homework: string;
  tutorNote?: string;
  followUpCreated?: boolean;
}

export interface FollowUp {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  contactMethod: string;
  contactDetail: string;
  isOverdue: boolean;
}
