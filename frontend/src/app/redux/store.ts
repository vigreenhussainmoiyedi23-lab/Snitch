import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice.js";
import productReducer from "../../features/products/productSlice.js";
import cartReducer from "../../features/cart/cart.slice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart:cartReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
