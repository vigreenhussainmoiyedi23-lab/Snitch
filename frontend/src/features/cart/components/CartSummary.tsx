import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Tag } from "lucide-react";
import ClearCartButton from "./ClearCartButton";

interface CartSummaryProps {
  totalAmount: number;
  isCheckoutPage?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalAmount,
  isCheckoutPage = false,
}) => {
  const shipping = totalAmount < 1500 ? 100 : 0; // Placeholder for free shipping
  const discount = 0; // Placeholder for discount
  const finalTotal = totalAmount + shipping - discount;
  const gst = 0.18 * finalTotal;
  return (
    <div className="bg-[var(--color-background-light)] p-5 sm:p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] flex flex-col gap-6 w-full animate-in fade-in zoom-in-95 duration-500">
      {!isCheckoutPage && (
        <h3 className="font-semibold text-lg text-[var(--color-text)] tracking-wide">
          Order Summary
        </h3>
      )}

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center text-[var(--color-text-muted)]">
          <span>Subtotal</span>
          <span className="font-medium text-[var(--color-text)]">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-[var(--color-text-muted)]">
          <span>Shipping</span>
          <span className="font-medium text-[var(--color-text)]">
            {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-[var(--color-text-muted)]">
          <span>GST (18%)</span>
          <span className="font-medium text-[var(--color-text)]">
            ₹{gst.toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-[var(--color-success)]">
            <span>Discount</span>
            <span className="font-medium">-₹{discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] flex justify-between items-center text-lg font-semibold text-[var(--color-text)]">
        <span>Total</span>
        <span className="tracking-wide">₹{(finalTotal + gst).toFixed(2)}</span>
      </div>
      <span className="text-xs text-text">
        Shipping Free on orders above ₹1500
      </span>

      {/* Coupon Placeholder */}
      {/* <div className="relative mt-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Tag className="w-4 h-4 text-[var(--color-text-subtle)]" />
        </div>
        <input
          type="text"
          placeholder="Discount code"
          className="w-full pl-10 pr-24 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder:text-[var(--color-text-subtle)] text-[var(--color-text)]"
        />
        <button className="absolute right-1.5 top-1.5 bottom-1.5 px-4 text-xs font-medium bg-[var(--color-background-subtle)] hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:text-white rounded-[var(--radius-sm)] transition-colors border border-[var(--color-border)] hover:border-transparent">
          Apply
        </button>
      </div> */}

      {!isCheckoutPage && (
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-dark)] px-4 py-3.5 rounded-[var(--radius-md)] shadow-[var(--shadow-medium)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98] group mt-2"
        >
          <ShoppingBag className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-medium tracking-wide text-base">
            Proceed to Checkout
          </span>
        </Link>
      )}

      <div className="mt-2 pt-2 border-t border-[var(--color-border)]/20">
        <ClearCartButton />
      </div>
    </div>
  );
};

export default CartSummary;
