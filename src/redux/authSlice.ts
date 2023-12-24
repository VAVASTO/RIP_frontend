// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthState {
  authToken: string | null;
}

const initialState: AuthState = {
  authToken: Cookies.get('authToken') || null,
};

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    try {
      // Отправляем запрос на сервер для выхода
      await axios.get('http://localhost:8000/users/logout/');
    } catch (error) {
      console.error('Error during logout:', error);
      // Возможно, вы захотите обработать ошибку здесь
    }
  });

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      Cookies.set('authToken', action.payload);
    },
    clearAuthToken: (state) => {
      state.authToken = null;
      Cookies.remove('authToken');
    },
  },
  extraReducers: (builder) => {
    // Добавляем обработчик для асинхронного экшена logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      // Вызываем clearAuthToken, чтобы удалить токен из Redux и кук
      state.authToken = null;
      Cookies.remove('authToken');
    });
    }
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
