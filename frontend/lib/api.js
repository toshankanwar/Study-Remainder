import axios from 'axios';

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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Study Schedule API
export const studyAPI = {
  create: (data) => api.post('/study-schedules', data),
  getAll: (params) => api.get('/study-schedules', { params }),
  getById: (id) => api.get(`/study-schedules/${id}`),
  update: (id, data) => api.put(`/study-schedules/${id}`, data),
  delete: (id) => api.delete(`/study-schedules/${id}`),
  toggle: (id) => api.patch(`/study-schedules/${id}/toggle`),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
