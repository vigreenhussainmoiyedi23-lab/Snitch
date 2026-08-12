import type { product, variant } from "../../products/types/product.type";

export type CartItem = {
  product: product
  quantity: number;
  isVariant: boolean;
  variant: variant | null;
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
