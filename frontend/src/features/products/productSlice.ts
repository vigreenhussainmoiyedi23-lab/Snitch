import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { product } from "./types/product.type";
type Enums = {
  categories: string[];
  subCategories: { name: string; category: string }[];
  brands: string[];
};
type InitialState = {
  error: string | null;
  products: any[];
  totalPages: number;
  slugProduct: product | null;
  loading: boolean;
  enums: Enums;
  totalProducts: number;
};
const initialState: InitialState = {
  error: null,
  products: [],
  totalPages: 1,
  totalProducts: 0,
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
    setGetProducts: (
      state,
      action: PayloadAction<{
        products: any[];
        totalPages: number;
        total: number;
      }>,
    ) => {
      state.products = action.payload.products;
      state.totalPages = action.payload.totalPages;
      state.totalProducts = action.payload.total;
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

export const {
  setError,
  setGetProducts,
  setSlugProduct,
  setLoading,
  setEnums,
} = productSlice.actions;

export default productSlice.reducer;
