import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../Hooks/useCart";
import type { product } from "../../products/types/product.type";
import { useAppSelector } from "../../../app/redux/hook";
import type { CartItem } from "../@types/cart.types";
import { useState } from "react";

const AddToCartButton = ({
  product,
}: {
  product: product;
  quantity: number;
}) => {
  const [quantity, setQuantity] = useState(1);
  const CartItems = useAppSelector((state) => state.cart.cartItems);
  const isAlreadyInCart = CartItems.some(
    (item) => item.product._id === product._id,
  );
  const { AddToCartHandler } = useCart();
  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "inc" && quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else if (type === "dec" && quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };
  if (isAlreadyInCart) return null;
  return (
    <div className="flex items-center flex-wrap gap-3">
      {/* Quantity */}
      <div className="flex items-center justify-between sm:justify-start border-2 border-border rounded-radius-sm p-1 sm:w-max">
        <button
          onClick={() => handleQuantity("dec")}
          className="p-3 hover:bg-yellow-300/30 rounded-radius-sm text-text-subtle transition-colors"
          disabled={quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-16 sm:w-12 text-center teko text-2xl font-medium">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantity("inc")}
          className="p-3 hover:bg-yellow-300/30 rounded-radius-sm text-text-subtle transition-colors"
          disabled={quantity >= product.stock}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={() => {
          AddToCartHandler({ product, quantity });
        }}
        className="flex-1 bg-white text-text teko text-2xl px-4 py-3 rounded-radius-sm hover:bg-white/90 border border-border  transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
      >
        <ShoppingCart className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartButton;
