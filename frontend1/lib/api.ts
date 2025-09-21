// lib/api.ts
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
}

export interface StudySchedule {
  _id: string;
  studyTopic: string;
  studyTime: string;
  days: string[];
  description?: string;
  isActive: boolean;
  reminderSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/login', data),
  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/auth/profile'),
};

// Study Schedule API
export const studyAPI = {
  create: (data: Partial<StudySchedule>): Promise<AxiosResponse<ApiResponse<{ schedule: StudySchedule }>>> =>
    api.post('/study-schedules', data),
  getAll: (params?: any): Promise<AxiosResponse<ApiResponse<{ schedules: StudySchedule[]; pagination: any }>>> =>
    api.get('/study-schedules', { params }),
  getById: (id: string): Promise<AxiosResponse<ApiResponse<{ schedule: StudySchedule }>>> =>
    api.get(`/study-schedules/${id}`),
  update: (id: string, data: Partial<StudySchedule>): Promise<AxiosResponse<ApiResponse<{ schedule: StudySchedule }>>> =>
    api.put(`/study-schedules/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/study-schedules/${id}`),
  toggle: (id: string): Promise<AxiosResponse<ApiResponse<{ schedule: StudySchedule }>>> =>
    api.patch(`/study-schedules/${id}/toggle`),
};

export default api;
