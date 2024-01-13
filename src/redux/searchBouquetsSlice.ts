import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchBouquetsState {
  searchText: string;
  price: string;
}

const initialState: SearchBouquetsState = {
  searchText: '',
  price: '',
};

const searchBouquetsSlice = createSlice({
  name: 'searchBouquets',
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
  },
});

export const { setSearchText, setPrice } = searchBouquetsSlice.actions;
export default searchBouquetsSlice.reducer;
