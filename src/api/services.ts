import { apiFetch } from './client';
import { Student, ClassNote, FollowUp, TutorProfile, DashboardMetrics } from '../types';

export const authApi = {
  login: (credentials: { email?: string; password?: string }) =>
    apiFetch<{ success: boolean; token: string; tutor: TutorProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

export const tutorApi = {
  getProfile: () =>
    apiFetch<{ success: boolean; data: TutorProfile }>('/tutor/profile'),
  updateProfile: (data: Partial<TutorProfile>) =>
    apiFetch<{ success: boolean; message: string; data: TutorProfile }>('/tutor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const studentsApi = {
  list: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ success: boolean; total: number; page: number; data: Student[] }>(`/students${queryString}`);
  },

  getById: (id: string) =>
    apiFetch<{
      success: boolean;
      data: {
        student: Student;
        recentNotesCount: number;
        activeFollowUpsCount: number;
      };
    }>(`/students/${id}`),

  create: (studentData: {
    name: string;
    grade: string;
    course: string;
    parentPhone: string;
    parentName?: string;
    schedule?: string;
  }) =>
    apiFetch<{ success: boolean; message: string; data: Student }>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
};

export const classNotesApi = {
  list: (params?: { studentId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.studentId) query.append('studentId', params.studentId);
    if (params?.limit) query.append('limit', String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ success: boolean; total: number; data: ClassNote[] }>(`/class-notes${queryString}`);
  },

  create: (noteData: {
    studentId: string;
    topic: string;
    understanding: 'Excellent' | 'Good Understanding' | 'Needs Practice' | 'Struggling';
    duration?: string;
    subject?: string;
    homework?: string;
    tutorNote?: string;
  }) =>
    apiFetch<{ success: boolean; message: string; data: ClassNote }>('/class-notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    }),
};

export const followUpsApi = {
  list: (params?: { filter?: string; studentId?: string }) => {
    const query = new URLSearchParams();
    if (params?.filter && params.filter !== 'All') query.append('filter', params.filter);
    if (params?.studentId) query.append('studentId', params.studentId);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch<{ success: boolean; total: number; data: FollowUp[] }>(`/follow-ups${queryString}`);
  },

  create: (followUpData: {
    studentId: string;
    dueDate: string;
    objective: string;
    dueTime?: string;
    parentPhone?: string;
    draftMessage?: string;
  }) =>
    apiFetch<{ success: boolean; message: string; data: FollowUp }>('/follow-ups', {
      method: 'POST',
      body: JSON.stringify(followUpData),
    }),

  toggleStatus: (id: string, isDone: boolean) =>
    apiFetch<{ success: boolean; message: string; data: { id: string; isDone: boolean } }>(
      `/follow-ups/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isDone }),
      }
    ),
};

export const dashboardApi = {
  getMetrics: () =>
    apiFetch<{ success: boolean; data: DashboardMetrics }>('/dashboard/metrics'),
};
