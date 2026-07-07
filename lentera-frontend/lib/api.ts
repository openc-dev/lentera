import axios from 'axios';

type ApiErrorData = {
  message?: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor: Otomatis masukin Bearer Token kalau user udah login
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const isApiStatus = (error: unknown, status: number) => {
  return axios.isAxiosError(error) && error.response?.status === status;
};

export const isUnauthorizedError = (error: unknown) => {
  return isApiStatus(error, 401);
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorData>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const setSudoHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['X-Sudo-Token'] = token;
  } else {
    delete api.defaults.headers.common['X-Sudo-Token'];
  }
};

export default api;
