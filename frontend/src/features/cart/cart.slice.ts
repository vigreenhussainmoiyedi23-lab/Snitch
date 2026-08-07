import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartSlice } from "./@types/cart.types";

const initialState: CartSlice = {
  cartItems: [],
  totalAmount: 0,
  loading: false,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload;
    },
    setCart: (
      state,
      action: PayloadAction<{ cartItems: CartItem[]; totalAmount: number }>,
    ) => {
      state.cartItems = action.payload.cartItems;
      state.totalAmount = action.payload.totalAmount;
    },
  },
});

export const { setCartItems, setTotalAmount, setLoading, setCart } =
  cartSlice.actions;

export default cartSlice.reducer;
