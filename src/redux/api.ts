// src/redux/api.ts

import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000', // Замените на ваш реальный URL
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
