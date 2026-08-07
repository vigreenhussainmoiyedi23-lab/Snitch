import React from 'react';
import type { CartItem as CartItemType } from '../@types/cart.types';
import CartQuantityControls from './CartQuantityControls';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity } = item;
  
  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-border)] group last:border-b-0 animate-in fade-in duration-300">
      <Link to={`/product/${product.slug}`} className="shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <img 
          src={product.images[0].thumbnailUrl} 
          alt={product.title} 
          className="w-20 h-24 sm:w-24 sm:h-28 object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link to={`/product/${product.slug}`} className="text-[var(--color-text)] font-medium line-clamp-2 hover:text-[var(--color-primary)] transition-colors pr-4 leading-tight">
              {product.title}
            </Link>
            <span className="font-semibold text-[var(--color-text)] whitespace-nowrap">
              {product.currency || '₹'}{product.finalPrice}
            </span>
          </div>
          {product.brand && (
            <p className="text-[var(--color-text-subtle)] text-sm mt-1">{product.brand}</p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="w-full max-w-[140px] sm:max-w-[150px]">
            <CartQuantityControls 
              productId={product._id} 
              quantity={quantity} 
              stock={product.stock}
            />
          </div>
          <div className="text-right shrink-0">
            <p className="text-[var(--color-text-subtle)] text-xs mb-0.5">Subtotal</p>
            <p className="font-medium text-[var(--color-text)] tabular-nums">{product.currency || '₹'}{(product.finalPrice * quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
