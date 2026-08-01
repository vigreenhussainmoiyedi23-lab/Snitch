import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
  error: string | null;
  products: any[];
  totalPages: number;
};
const initialState: InitialState = {
  error: null,
  products: [],
  totalPages: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<any[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setError, setProducts } = productSlice.actions;

export default productSlice.reducer;
