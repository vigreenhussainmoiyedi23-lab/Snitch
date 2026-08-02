import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { product } from "./types/product.type";
type Enums = {
  categories: string[];
  subCategories: string[];
  brands: string[];
};
type InitialState = {
  error: string | null;
  products: any[];
  totalPages: number;
  slugProduct: product | null;
  loading: boolean;
  enums: Enums;
};
const initialState: InitialState = {
  error: null,
  products: [],
  totalPages: 1,
  slugProduct: null,
  loading: false,
  enums: {
    categories: [],
    subCategories: [],
    brands: [],
  },
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
    setSlugProduct: (state, action: PayloadAction<product>) => {
      state.slugProduct = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEnums: (state, action: PayloadAction<Enums>) => {
      state.enums = action.payload;
    },
  },
});

export const { setError, setProducts, setSlugProduct, setLoading,setEnums } =
  productSlice.actions;

export default productSlice.reducer;
