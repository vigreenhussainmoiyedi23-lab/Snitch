import React from 'react';
import type { CartItem as CartItemType } from '../@types/cart.types';
import CartQuantityControls from './CartQuantityControls';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity, isVariant, variant } = item;

  const finalPrice = isVariant && variant ? variant.finalPrice : product.finalPrice;
  const image = isVariant && variant && variant.images && variant.images.length > 0
    ? variant.images[0].thumbnailUrl || variant.images[0].url
    : product.images[0].thumbnailUrl || product.images[0].url;
  const stock = isVariant && variant ? variant.stock : product.stock;
  const currencySign = product.currency === "INR" ? '₹' : product.currency === "USD" ? "$" : "€";
  return (
    <div className="flex  gap-4 py-4 border-b border-border group last:border-b-0 animate-in fade-in duration-300">
      <Link to={`/product/${product.slug}`} className="w-1/4 shrink-0 overflow-hidden rounded-radius-md border border-border">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full  object-cover object-center group-hover:scale-105 transition-transform duration-500 bg-white"
        />
      </Link>
      <div className="flex  flex-col flex-1 justify-between py-1">
        <div>
          <div className="flex relative justify-between items-start gap-2">
            <Link to={`/product/${product.slug}`} className="text-text font-medium line-clamp-2 hover:text-primary transition-colors pr-4 leading-tight">
              {product.title}
            </Link>
            <span className="font-semibold text-text whitespace-nowrap">
              {currencySign}{"\t"}{finalPrice}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              {product.brand && (
                <p className="text-text-subtle text-sm mt-1">{product.brand}</p>
              )}

              {isVariant && variant && variant.attributes && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(variant.attributes).map(([key, value]) => (
                    <span key={key} className="text-xs text-text-subtle bg-background-light px-2 py-1 rounded-radius-sm capitalize border border-border/50">
                      {key}: {value as string}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-left flex items-center sm:flex-col justify-end sm:justify-end w-fit  rounded-radius-sm">
              <p className="font-medium text-text tabular-nums text-sm">{currencySign}{"\t"} {(finalPrice * quantity).toFixed(2)}</p>
              <p className="text-text-subtle text-xs  uppercase tracking-wider font-semibold">Subtotal</p>
            </div>
          </div>
        </div>
        <div className="mt-4    gap-4">
          <div className="w-full sm:w-auto">
            <CartQuantityControls
              productId={product._id}
              quantity={quantity}
              stock={stock}
              variantId={isVariant && variant ? variant._id : undefined}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartItem;
