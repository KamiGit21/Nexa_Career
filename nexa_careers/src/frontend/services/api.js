import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// un interceptor para manejar errores globales :)
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en petición API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;