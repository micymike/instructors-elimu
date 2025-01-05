import axios from 'axios';
import { auth } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshed = await auth.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${auth.getToken()}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        auth.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
