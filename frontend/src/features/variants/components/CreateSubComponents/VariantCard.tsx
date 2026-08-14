import React from "react";
import { motion } from "framer-motion";
import { Package, Edit2, Trash2 } from "lucide-react";

interface VariantCardProps {
  variant: any;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getAttrsObj: (v: any) => Record<string, string>;
}

const VariantCard: React.FC<VariantCardProps> = ({
  variant,
  isEditing,
  onEdit,
  onDelete,
  getAttrsObj,
}) => {
  const attrs = getAttrsObj(variant);

  return (
    <motion.div
      key={variant._id}
      layout
      className="border border-border/30 rounded-radius-md overflow-hidden bg-background"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="p-4 flex items-start gap-3">
        {variant.images?.[0]?.url ? (
          <img
            src={variant.images[0].url}
            alt="variant"
            className="w-14 h-14 rounded-radius-sm object-cover border border-border/20 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-radius-sm bg-background-light flex items-center justify-center shrink-0 border border-border/20">
            <Package className="w-5 h-5 text-text-subtle/40" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {Object.entries(attrs).map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full border border-primary/15 teko tracking-wider"
              >
                <span className="capitalize">{k}:</span>
                <span className="capitalize">{v}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs mate text-text-subtle">
            <span>
              MRP:{" "}
              <span className="text-text font-medium">
                Rs.{variant.mrp}
              </span>
            </span>
            <span>
              Price:{" "}
              <span className="text-primary-dark font-medium">
                Rs.{variant.finalPrice || variant.mrp}
              </span>
            </span>
            {variant.discount > 0 && (
              <span>
                Discount:{" "}
                <span className="text-text font-medium">
                  {variant.discount}%
                </span>
              </span>
            )}
            <span>
              Stock:{" "}
              <span
                className={`font-medium ${variant.stock > 0 ? "text-success-dark" : "text-danger-dark"}`}
              >
                {variant.stock}
              </span>
            </span>
          </div>
          <p className="text-xs text-text-subtle/50 mt-1 truncate">
            SKU: {variant.sku}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={onEdit}
            className={`p-2 rounded-radius-sm border transition-all active:scale-90 ${isEditing ? "bg-primary text-white border-primary" : "border-border/40 text-text-subtle hover:text-primary hover:border-primary/40 hover:bg-primary/5"}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-radius-sm border border-border/40 text-text-subtle hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VariantCard;
