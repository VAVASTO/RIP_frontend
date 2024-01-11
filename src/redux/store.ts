// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customParamsReducer from './customParamsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customParams: customParamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
