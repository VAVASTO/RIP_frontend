// authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axios from 'axios';

interface AuthState {
  authToken: string | null;
  username: string | null;
  user_role: string | null;
}

const initialUsername = localStorage.getItem('username') || null;
const initialUser_role = localStorage.getItem('user_role') || null;

const initialState: AuthState = {
  authToken: Cookies.get('session_key') || null,
  username: initialUsername,
  user_role: initialUser_role
};

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    // Send a request to the server to log out
    await axios.get('http://localhost:8000/users/logout/', {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Error during logout:', error);
    // You might want to handle the error here
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      Cookies.set('session_key', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      // Update local storage whenever the username changes
      localStorage.setItem('username', action.payload);
    },
    setUser_role: (state, action: PayloadAction<string>) => {
      state.user_role = action.payload;
      // Update local storage whenever the username changes
      localStorage.setItem('user_role', action.payload);
    },
    clearAuthToken: (state) => {
      state.authToken = null;
      Cookies.remove('session_key');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.authToken = null;
      Cookies.remove('session_key');
    });
  },
});

export const { setAuthToken, setUsername, setUser_role, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
