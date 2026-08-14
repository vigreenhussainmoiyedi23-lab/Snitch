import React from "react";

interface PriceInputsProps {
  mrp: string;
  discount: string;
  stock: string;
  onMrpChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  onStockChange: (value: string) => void;
}

const PriceInputs: React.FC<PriceInputsProps> = ({
  mrp,
  discount,
  stock,
  onMrpChange,
  onDiscountChange,
  onStockChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(
        [
          { label: "MRP (Rs.)", key: "mrp" as const, ph: "0" },
          { label: "Discount (%)", key: "discount" as const, ph: "0" },
          { label: "Stock", key: "stock" as const, ph: "0" },
        ] as const
      ).map(({ label, key, ph }) => (
        <div key={key}>
          <label className="mate text-xs text-text-subtle block mb-1">
            {label}
          </label>
          <input
            type="number"
            value={key === "mrp" ? mrp : key === "discount" ? discount : stock}
            min="0"
            max={key === "discount" ? "100" : undefined}
            placeholder={ph}
            onChange={(e) => {
              if (key === "mrp") onMrpChange(e.target.value);
              else if (key === "discount") onDiscountChange(e.target.value);
              else onStockChange(e.target.value);
            }}
            className="w-full px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
        </div>
      ))}
    </div>
  );
};

export default PriceInputs;
