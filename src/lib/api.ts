import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://os-project-server.vercel.app/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// Helper for handling API errors
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response?.data || { message: error.message };
  }
  throw error;
};

// Login
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/existinguser', { username, password });
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error, error?.response);
    let errorMessage = 'Login failed';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection or CORS settings.';
    }
    throw new Error(errorMessage);
  }
};

// Register
export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await api.post('/newuser', { username, email, password });
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error, error?.response);
    let errorMessage = 'Registration failed';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection or CORS settings.';
    }
    throw new Error(errorMessage);
  }
};

// Send OTP
export const sendOtp = async (email: string) => {
  try {
    const response = await api.post('/send-otp', { email });
    return response.data;
  } catch (error: any) {
    console.error('Send OTP error:', error, error?.response);
    let errorMessage = 'Failed to send OTP';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection or CORS settings.';
    }
    throw new Error(errorMessage);
  }
};

// Reset Password
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await api.post('/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error: any) {
    console.error('Reset password error:', error, error?.response);
    let errorMessage = 'Failed to reset password';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection or CORS settings.';
    }
    throw new Error(errorMessage);
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    const data = response.data;
    const users = Array.isArray(data) ? data : Array.isArray(data?.users) ? data.users : [];
    return users;
  } catch (error: any) {
    console.error('Fetch users error:', error, error?.response);
    let errorMessage = 'Failed to fetch users';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection or CORS settings.';
    }
    throw new Error(errorMessage);
  }
};
