import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
type VariantSlice = {
    loading: boolean;
    variants: any[]
}
const initialState: VariantSlice = {
    loading:false,
    variants:[]
}
const variantSlice = createSlice({
  name: "variant",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export default variantSlice;
