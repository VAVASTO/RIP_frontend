// customParamsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CustomParamsState {
  customParams: {
    start_date?: string;
    end_date?: string;
  };
}

const initialState: CustomParamsState = {
  customParams: {},
};

const customParamsSlice = createSlice({
  name: 'customParams',
  initialState,
  reducers: {
    setCustomParams: (state, action: PayloadAction<{ start_date?: string; end_date?: string }>) => {
      state.customParams = { ...state.customParams, ...action.payload };
    },
  },
});

export const { setCustomParams } = customParamsSlice.actions;

export default customParamsSlice.reducer;
