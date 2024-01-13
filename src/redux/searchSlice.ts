// searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  clientName: string;
}

const initialState: SearchState = {
  clientName: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setClientName: (state, action: PayloadAction<string>) => {
      state.clientName = action.payload;
    },
  },
});

export const { setClientName } = searchSlice.actions;

export default searchSlice.reducer;