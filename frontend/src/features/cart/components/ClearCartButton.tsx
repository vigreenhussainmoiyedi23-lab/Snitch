import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "../Hooks/useCart";

const ClearCartButton: React.FC = () => {
  const { DeleteCartHandler } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear your cart?");
    if (!confirmClear) return;
    setIsClearing(true);
    try {
      await DeleteCartHandler();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleClear}
      disabled={isClearing}
      className="flex items-center justify-center gap-2 w-full border border-[var(--color-danger)]/30 hover:border-transparent bg-transparent hover:bg-[var(--color-danger)] text-[var(--color-danger)] hover:text-white px-4 py-3 rounded-[var(--radius-md)] transition-all duration-300 active:scale-[0.98] outline-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed group text-sm font-medium"
    >
      <Trash2 className="w-4 h-4 group-hover:scale-105 transition-transform" />
      <span>{isClearing ? "Clearing..." : "Clear Cart"}</span>
    </button>
  );
};

export default ClearCartButton;
