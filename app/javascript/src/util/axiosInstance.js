import axios from 'axios';

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    config.baseURL = '/api';
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
