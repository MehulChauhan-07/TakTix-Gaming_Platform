import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

// Create axios instance
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with an error
      const message = error.response.data?.message || 'An error occurred';
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Error in request configuration
      console.error('Request configuration error:', error.message);
      return Promise.reject(new Error('Error in request configuration.'));
    }
  }
); 