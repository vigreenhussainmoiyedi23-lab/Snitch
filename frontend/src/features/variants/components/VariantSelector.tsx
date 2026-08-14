import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VariantSelectorProps {
  allKeys: string[];
  selectedAttrs: Record<string, string>;
  getAvailableValues: (key: string, baseSelections: Record<string, string>) => string[];
  onSelectAttr: (key: string, value: string) => void;
  selectedVariant: any;
  baseProduct: any;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  allKeys,
  selectedAttrs,
  getAvailableValues,
  onSelectAttr,
  selectedVariant,
  baseProduct,
}) => {
  return (
    <div className="space-y-5">
      {allKeys.map((key) => {
        const available = getAvailableValues(key, selectedAttrs);
        if (available.length === 0) return null;
        return (
          <div key={key}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="mate text-sm font-semibold text-text capitalize">
                {key}
              </span>
              {selectedAttrs[key] && (
                <span className="text-xs text-text-subtle bg-background-light px-2 py-0.5 rounded-full capitalize">
                  {selectedAttrs[key]}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {available.map((val) => {
                const isActive = selectedAttrs[key] === val;

                return (
                  <button
                    key={val}
                    onClick={() => onSelectAttr(key, val)}
                    className={`px-4 py-2 rounded-radius-sm border-2 mate text-sm font-medium capitalize transition-all duration-200 ${isActive ? "border-primary bg-primary text-white shadow-soft" : "border-border/40 bg-background text-text hover:border-primary/50 hover:bg-background-light"}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <AnimatePresence>
        {selectedVariant && (
          <motion.div
            key="vi"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-2 p-4 rounded-radius-md h-32 bg-primary/5 border border-primary/20 flex flex-wrap items-center gap-5">
              <div className="h-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={selectedVariant.images[0]?.url || baseProduct.images[0].url}
                  alt="variant image"
                />
              </div>
              <div>
                <p className="mate text-xs text-text-subtle mb-0.5">
                  Variant Price
                </p>
                <p className="teko text-3xl text-primary-dark font-medium leading-none">
                  Rs.{selectedVariant.finalPrice || selectedVariant.mrp}
                </p>
                {selectedVariant.mrp > (selectedVariant.finalPrice || 0) && (
                  <div>
                    <p className="mate text-xs text-text-subtle mb-0.5">
                      MRP
                    </p>
                    <p className="teko text-xl text-text-subtle line-through leading-none">
                      Rs.{selectedVariant.mrp}
                    </p>
                  </div>
                )}
                {selectedVariant.discount > 0 && (
                  <div className="bg-success-light/20 text-success-dark px-2.5 py-1 rounded-full">
                    <p className="teko text-base leading-none">
                      Save {selectedVariant.discount}%
                    </p>
                  </div>
                )}
                <div className="ml-auto">
                  <p className="mate text-xs text-text-subtle mb-0.5">
                    Availability
                  </p>
                  <div
                    className={`flex items-center gap-1.5 mate text-sm font-medium ${selectedVariant.stock > 0 ? "text-success-dark" : "text-danger-dark"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? "bg-success animate-pulse" : "bg-danger"}`}
                    />
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} in stock`
                      : "Out of stock"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VariantSelector;
