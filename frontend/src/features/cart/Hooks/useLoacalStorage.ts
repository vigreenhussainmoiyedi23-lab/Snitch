import type { CartItem } from "../@types/cart.types";

export const EMPTY_CART = {
  cartItems: [],
  totalAmount: 0,
};

const getLocalCart = (): {
  cartItems: CartItem[];
  totalAmount: number;
} => {
  try {
    const storedCart = localStorage.getItem("cart");

    if (!storedCart) {
      return EMPTY_CART;
    }

    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart.cartItems)) {
      return EMPTY_CART;
    }

    return {
      cartItems: parsedCart.cartItems,
      totalAmount: parsedCart.totalAmount ?? 0,
    };
  } catch {
    return EMPTY_CART;
  }
};

const saveLocalCart = (cart: {
  cartItems: CartItem[];
  totalAmount: number;
}) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const isSameCartItem = (
  cartItem: CartItem,
  productId: string,
  variantId?: string,
) => {
  const sameProduct = cartItem.product._id.toString() === productId.toString();

  if (!sameProduct) return false;

  if (variantId) {
    return cartItem.variant?._id?.toString() === variantId.toString();
  }

  return !cartItem.variant;
};

export { getLocalCart, saveLocalCart, isSameCartItem };
