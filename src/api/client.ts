import axios, { AxiosError } from 'axios';

// Create a generic Axios instance
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to inject JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    // Prevent sending literal "undefined" or "null" strings which crash the backend JWT parser
    if (token && token !== 'undefined' && token !== 'null' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token === 'undefined' || token === 'null') {
      // Clean up corrupt local storage
      localStorage.removeItem('jwt_token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Gracefully handle 401 by clearing invalid token and redirecting
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_profile');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
