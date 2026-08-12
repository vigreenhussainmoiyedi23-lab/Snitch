import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type VariantSlice = {
  loading: boolean;
  variants: any[];
  error: string;
};
const initialState: VariantSlice = {
  loading: false,
  error: "",
  variants: [],
};
const variantSlice = createSlice({
  name: "variant",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setVariants: (state, action: PayloadAction<any[]>) => {
      state.variants = action.payload
    }
  },
});
export const { setLoading, setError, setVariants } = variantSlice.actions;

export default variantSlice.reducer;
