import axios, { AxiosError } from 'axios';

// Ensure the base URL always ends with /api/v1 and doesn't have double slashes
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://medion-6dal.onrender.com';
const cleanBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
const finalBaseUrl = cleanBaseUrl.endsWith('/api/v1') ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`;

// Create a generic Axios instance
export const apiClient = axios.create({
  baseURL: finalBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to inject JWT
apiClient.interceptors.request.use(
  (config) => {
    // List of exact endpoint paths that do NOT require Authorization Header
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
    ];
    
    // Some endpoints are conditionally public (e.g., GET /stores, GET /products/active)
    const isPublicStoreGet = config.url?.startsWith('/stores') && config.method?.toLowerCase() === 'get' && !config.url?.includes('/my-store');
    const isPublicProductsGet = config.url?.startsWith('/products') && config.method?.toLowerCase() === 'get' && !config.url?.includes('reviews'); // assuming products/active or products/{id}

    const isPublicEndpoint = publicEndpoints.includes(config.url || '') || isPublicStoreGet || isPublicProductsGet;

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('jwt_token');
      // Prevent sending literal "undefined" or "null" strings which crash the backend JWT parser
      if (token && token !== 'undefined' && token !== 'null' && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token === 'undefined' || token === 'null') {
        // Clean up corrupt local storage
        localStorage.removeItem('jwt_token');
      }
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
