import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../Hooks/useCart';
import type { product } from '../../products/types/product.type';

interface AddToCartButtonProps {
  product: product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { AddToCartHandler } = useCart();

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc' && quantity < product.stock) {
      setQuantity((q) => q + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await AddToCartHandler({ product, quantity });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border border-border bg-background rounded-[var(--radius-sm)] flex-shrink-0 min-w-[100px] flex-1 sm:flex-none h-11 sm:h-12 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-medium)]">
        <button
          onClick={() => handleQuantity('dec')}
          disabled={quantity <= 1 || isAdding}
          aria-label="Decrease quantity"
          className="h-full px-3 sm:px-4 text-text-subtle hover:text-text hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-l-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 flex items-center justify-center group"
        >
          <Minus className="w-4 h-4 group-active:scale-90 transition-transform" />
        </button>
        
        <span className="text-text font-medium text-sm sm:text-base w-8 text-center flex-1 tabular-nums tracking-wide">
          {quantity}
        </span>
        
        <button
          onClick={() => handleQuantity('inc')}
          disabled={quantity >= product.stock || isAdding}
          aria-label="Increase quantity"
          className="h-full px-3 sm:px-4 text-text-subtle hover:text-text hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-r-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 flex items-center justify-center group"
        >
          <Plus className="w-4 h-4 group-active:scale-90 transition-transform" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-2 min-w-35 flex items-center justify-center gap-2 bg-primary text-background hover:bg-primary-dark px-4 h-11 sm:h-12 rounded-[var(--radius-sm)] shadow-[var(--shadow-medium)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] group overflow-hidden relative border border-transparent hover:border-primary-light"
      >
        <span className={`flex items-center justify-center gap-2 w-full transition-transform duration-500 ease-out ${isAdding ? 'translate-y-[-150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 ease-out" />
          <span className="font-medium tracking-wide text-sm sm:text-base whitespace-nowrap">Add to Cart</span>
        </span>
        
        {isAdding && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-background-subtle border-t-background rounded-full animate-spin"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;
