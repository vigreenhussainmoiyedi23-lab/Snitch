import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../Hooks/useCart';

interface CartQuantityControlsProps {
  productId: string;
  quantity: number;
  stock: number;
  variantId?: string;
}

const CartQuantityControls: React.FC<CartQuantityControlsProps> = ({
  productId,
  quantity,
  stock,
  variantId,
}) => {
  const { UpdateCartItemHandler, DeleteCartItemHandler } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleIncrease = async () => {
    if (quantity >= stock || isUpdating || isDeleting) return;
    setIsUpdating(true);
    try {
      await UpdateCartItemHandler({ productId, increaseBy: 1, variantId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (quantity <= 1 || isUpdating || isDeleting) return;
    setIsUpdating(true);
    try {
      await UpdateCartItemHandler({ productId, decreaseBy: 1, variantId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isDeleting || isUpdating) return;
    setIsDeleting(true);
    try {
      await DeleteCartItemHandler(productId, variantId);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border border-border bg-background rounded-radius-sm flex-shrink-0 min-w-[100px] flex-1 sm:flex-none h-11 sm:h-12 shadow-soft transition-shadow hover:shadow-medium">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1 || isUpdating || isDeleting}
          aria-label="Decrease quantity"
          className="h-full px-3 sm:px-4 text-text-subtle hover:text-text hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-l-radius-sm outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 flex items-center justify-center group"
        >
          <Minus className="w-4 h-4 group-active:scale-90 transition-transform" />
        </button>
        
        <span className="text-text font-medium text-sm sm:text-base w-8 text-center flex-1 tabular-nums tracking-wide flex items-center justify-center">
          {isUpdating ? (
            <span className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
          ) : (
            quantity
          )}
        </span>
        
        <button
          onClick={handleIncrease}
          disabled={quantity >= stock || isUpdating || isDeleting}
          aria-label="Increase quantity"
          className="h-full px-3 sm:px-4 text-text-subtle hover:text-text hover:bg-background-subtle disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-r-radius-sm outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 flex items-center justify-center group"
        >
          <Plus className="w-4 h-4 group-active:scale-90 transition-transform" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isDeleting || isUpdating}
        aria-label="Remove item"
        className="flex-1 sm:flex-none min-w-[80px] h-11 sm:h-12 px-4 flex items-center justify-center gap-2 bg-background text-danger hover:bg-danger hover:text-white border border-border hover:border-transparent rounded-radius-sm shadow-soft transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
      >
        <span className={`flex items-center gap-2 transition-transform duration-300 ${isDeleting ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
          <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-medium text-sm sm:text-base tracking-wide hidden sm:inline-block">Remove</span>
        </span>
        
        {isDeleting && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-danger border-t-transparent group-hover:border-white group-hover:border-t-transparent rounded-full animate-spin"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default CartQuantityControls;
