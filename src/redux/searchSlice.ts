// searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
}

const initialState: SearchState = {
  clientName: '',
  startDate: '',
  endDate: '',
  status: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setClientName: (state, action: PayloadAction<string>) => {
        state.clientName = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
        state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
        state.endDate = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
        state.status = action.payload;
    },
  },
});

export const { setClientName, setStartDate, setEndDate, setStatus } = searchSlice.actions;

export default searchSlice.reducer;