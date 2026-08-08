import React, { useEffect, useRef } from "react";
import { useAppSelector } from "../../../app/redux/hook";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

interface CartSideMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartSideMenu: React.FC<CartSideMenuProps> = ({ isOpen, setIsOpen }) => {
  const { cartItems, totalAmount } = useAppSelector((state) => state.cart);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  console.log(cartItems);
  
  if(!cartItems ) return null

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] bg-[var(--color-background)] shadow-2xl z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-background)] z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-background-subtle)] p-2 rounded-[var(--radius-sm)]">
              <ShoppingBag className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-wide">
              Your Cart
            </h2>
            <span className="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-xs font-semibold px-2.5 py-1 rounded-full animate-in zoom-in duration-300">
              {itemCount}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[var(--color-danger)]/10 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] rounded-full transition-colors active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-32 h-32 bg-[var(--color-background-light)] border border-[var(--color-border)] rounded-full flex items-center justify-center mb-2 shadow-[var(--shadow-soft)]">
                <ShoppingBag
                  className="w-12 h-12 text-[var(--color-text-subtle)]"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="text-xl font-medium text-[var(--color-text)] mb-1">
                  Your cart is empty
                </p>
                <p className="text-sm text-[var(--color-text-subtle)] max-w-[250px] mx-auto leading-relaxed">
                  Looks like you haven't added any luxury items to your cart
                  yet.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-primary-dark)] px-8 py-3.5 rounded-[var(--radius-md)] shadow-[var(--shadow-medium)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] active:scale-[0.98] group"
              >
                <span className="font-medium tracking-wide">
                  Continue Shopping
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              <div className="flex-1 flex flex-col gap-2 pb-6">
                {cartItems.map((item, i) => (
                  <div
                    key={item.product._id || ""}
                    className="animate-in slide-in-from-right-8 duration-500"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-[var(--color-border)]">
                <CartSummary totalAmount={totalAmount} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSideMenu;
