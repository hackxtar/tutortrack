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

export interface TutorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string;
  autoReminderHours?: number;
  autoDraftMissedSession?: boolean;
  monthlyRenewalAlert?: boolean;
}

export interface DashboardMetrics {
  overdueCount: number;
  dueTodayCount: number;
  upcomingCount: number;
  activeStudentsCount: number;
  weeklyLessonRatio: {
    completed: number;
    target: number;
    percentage: number;
  };
}

export interface ClassNote {
  id: string;
  studentId?: string;
  date: string;
  time?: string;
  subject: string;
  topic: string;
  understanding: 'Excellent' | 'Good Understanding' | 'Needs Practice' | 'Struggling';
  covered?: string;
  homework?: string;
  tutorNote?: string;
  followUpCreated?: boolean;
}

export interface FollowUp {
  id: string;
  type: 'Overdue' | 'Today' | 'Upcoming';
  studentId: string;
  studentName: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  due: string;
  objective: string;
  draft: string;
  isDone?: boolean;
}


