interface Variant {
  _id: string;
  sku?: string;
  images?: { url: string }[];
}

interface VariantPickerProps {
  variants: Variant[];
  selectedVariantId: string | null;
  onVariantSelect: (variantId: string | null) => void;
  baseProductImages: { url: string }[];
}

const VariantPicker = ({ variants, selectedVariantId, onVariantSelect, baseProductImages }: VariantPickerProps) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 border-b border-border/20 pb-2">
        <h3 className="mate font-semibold text-text text-lg">Available Variants</h3>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {/* Original Product */}
        <button
          onClick={() => onVariantSelect(null)}
          title="Original Product"
          className={`shrink-0 w-20 h-24 rounded-radius-sm overflow-hidden border-2 transition-all duration-200 ${selectedVariantId === null ? 'border-primary shadow-medium scale-105' : 'border-border/40 opacity-70 hover:opacity-100 hover:border-primary/50'}`}
        >
          {baseProductImages?.[0]?.url ? (
            <img src={baseProductImages[0].url} alt="Original Product" className="w-full h-full object-cover bg-white" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background-light text-text-subtle text-xs text-center mate p-1">
              No Image
            </div>
          )}
        </button>

        {/* Variants */}
        {variants.map(v =>
          v?.images[0]?.url ? (
            <button
              key={v._id}
              onClick={() => onVariantSelect(v._id)}
              title={v.sku || "Variant"}
              className={`shrink-0 w-20 h-24 rounded-radius-sm overflow-hidden border-2 transition-all duration-200 ${selectedVariantId === v._id ? 'border-primary shadow-medium scale-105' : 'border-border/40 opacity-70 hover:opacity-100 hover:border-primary/50'}`}
            >
              <img src={v.images[0].url} alt={v.sku || "Variant"} className="w-full h-full object-cover bg-white" />
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default VariantPicker;
