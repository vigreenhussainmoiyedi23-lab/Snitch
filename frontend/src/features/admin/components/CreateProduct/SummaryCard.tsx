import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Package, Tag, TrendingDown, Layers, Eye, Star } from "lucide-react";
import type { ProductFormValues } from "./types";

// ── Sub-component ─────────────────────────────────────────

type SummaryRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  highlight?: "success" | "primary";
};

const SummaryRow = ({ icon, label, value, highlight }: SummaryRowProps) => {
  const valueClass =
    highlight === "success"
      ? "text-success font-semibold"
      : highlight === "primary"
      ? "text-primary font-semibold"
      : "text-background";

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-background-subtle flex-shrink-0">{icon}</span>
        <span className="mate text-xs text-background-subtle">{label}</span>
      </div>
      <span className={`mate text-xs ${valueClass} text-right`}>{value}</span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────

type SummaryCardProps = {
  imageCount: number;
};

/**
 * Sticky summary card — visual only.
 * Background: bg-text (#282420) matching the card design system.
 * Text: cream / subtle-cream on dark background.
 */
const SummaryCard = ({ imageCount }: SummaryCardProps) => {
  const { watch } = useFormContext<ProductFormValues>();

  const price = watch("price");
  const discount = watch("discount");
  const stock = watch("stock");
  const status = watch("status");
  const visibility = watch("visibility");
  const isFeatured = watch("isFeatured");

  const mrp = Number(price) || 0;
  const disc = Math.min(Math.max(Number(discount) || 0, 0), 100);
  const finalPrice = mrp > 0 ? mrp - (mrp * disc) / 100 : null;

  const ICON_CLASS = "w-3.5 h-3.5";

  return (
    <div
      className="bg-text border border-border rounded-[var(--radius-md)] overflow-hidden sticky top-24"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border bg-text-mutes">
        <h2 className="eczar text-sm font-bold text-background">Summary</h2>
        <p className="mate text-[11px] text-background-subtle mt-0.5">
          Live preview of your product
        </p>
      </div>

      {/* Rows */}
      <div className="px-5 py-2">
        <SummaryRow
          icon={<Tag className={ICON_CLASS} />}
          label="MRP"
          value={mrp > 0 ? `₹${mrp.toFixed(2)}` : "—"}
        />
        <SummaryRow
          icon={<TrendingDown className={ICON_CLASS} />}
          label="Discount"
          value={disc > 0 ? `${disc}%` : "—"}
        />
        {finalPrice !== null && (
          <SummaryRow
            icon={<Tag className={ICON_CLASS} />}
            label="Final Price"
            value={`₹${finalPrice.toFixed(2)}`}
            highlight="success"
          />
        )}
        <SummaryRow
          icon={<Package className={ICON_CLASS} />}
          label="Stock"
          value={stock ? String(stock) : "—"}
        />
        <SummaryRow
          icon={<Layers className={ICON_CLASS} />}
          label="Images"
          value={`${imageCount} / 5`}
          highlight={imageCount > 0 ? "primary" : undefined}
        />
        <SummaryRow
          icon={<Eye className={ICON_CLASS} />}
          label="Status"
          value={status || "published"}
        />
        <SummaryRow
          icon={<Eye className={ICON_CLASS} />}
          label="Visibility"
          value={visibility || "public"}
        />
        <SummaryRow
          icon={<Star className={ICON_CLASS} />}
          label="Featured"
          value={isFeatured ? "Yes" : "No"}
          highlight={isFeatured ? "primary" : undefined}
        />
      </div>
    </div>
  );
};

export default SummaryCard;
