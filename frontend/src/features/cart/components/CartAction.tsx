import React from "react";
import { useAppSelector } from "../../../app/redux/hook";
import type { product } from "../../products/types/product.type";
import AddToCartButton from "./AddToCartButton";
import CartQuantityControls from "./CartQuantityControls";

export interface CartActionProps {
  /**
   * The product object containing details like _id, stock, etc.
   */
  product: product;
  /**
   * Optional wrapper class name to adjust positioning or margins
   */

  className?: string;
  selectedVariant?: any;
}

const CartAction: React.FC<CartActionProps> = ({
  product,
  className = "",
  selectedVariant,
}) => {
  console.log(selectedVariant);

  const cartItems = useAppSelector((state) => state.cart.cartItems);

  // Use find() to determine whether the product is already in cart, as requested
  const cartItem = cartItems.find((item) => {
    if (item.isVariant && selectedVariant)
      return item.variant!._id === selectedVariant._id;
    else return item.product._id === product._id;
  });
  const isAlreadyInCart = !!cartItem;

  return (
    <div className={`w-full max-w-full ${className} `}>
      {isAlreadyInCart ? (
        <CartQuantityControls
          productId={product._id}
          quantity={cartItem.quantity}
          stock={product.stock}
        />
      ) : (
        <AddToCartButton product={product} selectedVairant={selectedVariant} />
      )}
    </div>
  );
};

export default CartAction;
