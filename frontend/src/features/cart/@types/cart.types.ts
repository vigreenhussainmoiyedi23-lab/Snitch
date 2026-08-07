import type { product } from "../../products/types/product.type";

export type CartItem = {
  product: product
  quantity: number;
};
export type CartSlice = {
  cartItems: CartItem[];
  totalAmount: number;
  loading: Boolean;
};

export type Cart = {
  cartItems: CartItem[];
  totalAmount: number;
};
