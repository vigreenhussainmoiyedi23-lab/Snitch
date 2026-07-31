import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type InitialState = {
  error: string | null;
  products: any[];
}
const initialState:InitialState = {
  error: null,
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {setError} = productSlice.actions;

export default productSlice.reducer;
