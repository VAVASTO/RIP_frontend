// src/redux/authThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, setAuthToken } from './api';
import { setToken, setError } from './authSlice';

interface LoginData {
  login: string;
  password: string;
}

export const loginUser = createAsyncThunk('auth/loginUser', async (data: LoginData, { dispatch }) => {
  try {
    const response = await api.post('/users/login/', data);
    const { token } = response.data;
    setAuthToken(token);
    dispatch(setToken(token));
  } catch (error) {
    dispatch(setError('Authentication failed'));
  }
});
