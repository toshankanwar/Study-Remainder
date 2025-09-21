// lib/api.ts
import axios, { AxiosResponse, AxiosError } from 'axios';

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
        config.headers.Authorization = Bearer ${token};
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeUser('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Base Types
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

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Auth Related Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Study Schedule Types
export interface CreateStudyScheduleRequest {
  studyTopic: string;
  studyTime: string;
  days: string[];
  description?: string;
  timezone?: string;
}

export interface UpdateStudyScheduleRequest extends Partial<CreateStudyScheduleRequest> {}

export interface StudyScheduleResponse {
  schedule: StudySchedule;
}

export interface StudyScheduleListResponse {
  schedules: StudySchedule[];
  pagination: PaginationInfo;
}

// Error Types
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Auth API
export const authAPI = {
  register: (data: RegisterRequest): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/register', data),
    
  login: (data: LoginRequest): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/login', data),
    
  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/auth/profile'),
    
  logout: (): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.post('/auth/logout'),
};

// Study Schedule API
export const studyAPI = {
  create: (data: CreateStudyScheduleRequest): Promise<AxiosResponse<ApiResponse<StudyScheduleResponse>>> =>
    api.post('/study-schedules', data),
    
  getAll: (params?: PaginationParams): Promise<AxiosResponse<ApiResponse<StudyScheduleListResponse>>> =>
    api.get('/study-schedules', { params }),
    
  getById: (id: string): Promise<AxiosResponse<ApiResponse<StudyScheduleResponse>>> =>
    api.get(/study-schedules/${id}),
    
  update: (id: string, data: UpdateStudyScheduleRequest): Promise<AxiosResponse<ApiResponse<StudyScheduleResponse>>> =>
    api.put(/study-schedules/${id}, data),
    
  delete: (id: string): Promise<AxiosResponse<ApiResponse<null>>> =>
    api.delete(/study-schedules/${id}),
    
  toggle: (id: string): Promise<AxiosResponse<ApiResponse<StudyScheduleResponse>>> =>
    api.patch(/study-schedules/${id}/toggle),
};

// Health API
export const healthAPI = {
  check: (): Promise<AxiosResponse<ApiResponse<{
    status: string;
    timestamp: string;
    cronStatus?: {
      totalJobs: number;
      jobs: string[];
      isRunning: boolean;
    };
  }>>> => api.get('/health'),
};

// Utility function for handling API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    
    if (axiosError.response?.data?.errors && Array.isArray(axiosError.response.data.errors)) {
      return axiosError.response.data.errors
        .map(err => err.message)
        .join(', ');
    }
    
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

// Type guards
export function isApiResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'message' in response
  );
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as ApiErrorResponse).success === false
  );
}

export default api;
