import React from "react";
import { useAppSelector } from "../../../app/redux/hook";
import type { product } from "../../products/types/product.type";
import AddToCartButton from "./AddToCartButton";
import CartQuantityControls from "./CartQuantityControls";
import { ShoppingBag } from "lucide-react";

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
  hasSelections?: boolean;
}

const CartAction: React.FC<CartActionProps> = ({
  product,
  className = "",
  selectedVariant,
  hasSelections,
}) => {

  const cartItems = useAppSelector((state) => state.cart.cartItems);

  const hasOptions = product.options && product.options.length > 0;

  if (hasOptions && hasSelections && !selectedVariant) {
    return (
      <div className={`w-full max-w-full ${className}`}>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 bg-primary/10 text-text-subtle/50 px-4 h-11 sm:h-12 rounded-[8px] border border-border/20 cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
          <span className="font-medium tracking-wide text-sm sm:text-base whitespace-nowrap">
            Select Options
          </span>
        </button>
      </div>
    );
  }

  // Use find() to determine whether the product is already in cart, as requested
  const cartItem = cartItems.find((item) => {
    if (selectedVariant) {
      return item.isVariant && item.variant?._id === selectedVariant._id;
    } else {
      return item.product._id === product._id && !item.isVariant;
    }
  });
  const isAlreadyInCart = !!cartItem;

  return (
    <div className={`w-full max-w-full ${className} `}>
      {isAlreadyInCart ? (
        <CartQuantityControls
          productId={product._id}
          quantity={cartItem.quantity}
          stock={selectedVariant ? selectedVariant.stock : product.stock}
          variantId={selectedVariant?._id}
        />
      ) : (
        <AddToCartButton product={product} selectedVairant={selectedVariant} />
      )}
    </div>
  );
};

export default CartAction;
