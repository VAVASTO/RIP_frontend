// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import customParamsReducer from './customParamsSlice';
import searchReducer from './searchSlice';
import searchBouquetsReducer from './searchBouquetsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customParams: customParamsReducer,
    search: searchReducer,
    searchBouquets: searchBouquetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
