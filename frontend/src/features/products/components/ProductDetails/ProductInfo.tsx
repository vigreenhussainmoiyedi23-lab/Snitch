import { Star } from "lucide-react";
import CartAction from "../../../cart/components/CartAction";
import { CreditCard } from "lucide-react";

interface ProductInfoProps {
  title?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  mrp?: number;
  finalPrice?: number;
  discount?: number;
  stock?: number;
  rating?: number | { average: number };
  product: any;
  selectedVariant?: any;
  hasSelections?: boolean;
}

const ProductInfo = ({
  title,
  brand,
  description,
  shortDescription,
  mrp,
  finalPrice,
  discount,
  stock,
  rating,
  product,
  selectedVariant,
  hasSelections,
}: ProductInfoProps) => {
  const getRatingValue = () => {
    if (typeof rating === "number") return rating;
    if (rating && typeof rating === "object" && "average" in rating)
      return rating?.average;
    return 0;
  };
  const ratingValue = getRatingValue();

  const displayMrp = selectedVariant ? selectedVariant.mrp : mrp;
  const displayFinalPrice = selectedVariant ? selectedVariant.finalPrice : (finalPrice || mrp);
  const displayDiscount = selectedVariant ? selectedVariant.discount : discount;
  const displayStock = selectedVariant !== undefined && selectedVariant !== null ? selectedVariant.stock : stock;

  return (
    <div className="w-full lg:w-1/2 flex flex-col animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="mb-2">
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
          {brand}
        </span>
      </div>

      <h1 className="eczar text-4xl md:text-5xl lg:text-6xl text-text mb-4 leading-tight capitalize">
        {title}
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex text-gold">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= ratingValue ? "fill-gold" : "fill-transparent border-gold"}`}
            />
          ))}
        </div>
        <span className="mate text-text-subtle text-sm">
          ({ratingValue} Reviews)
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-4 mb-6">
        <span className="teko text-5xl text-primary-dark font-medium">
          ₹{displayFinalPrice}
        </span>
        {displayMrp && displayFinalPrice && displayMrp > displayFinalPrice && (
          <>
            <span className="teko text-3xl text-text-subtle line-through opacity-70">
              ₹{displayMrp}
            </span>
            <span className="bg-success-light/20 text-success-dark px-2 py-1 rounded-radius-sm teko text-lg">
              Save {displayDiscount}%
            </span>
          </>
        )}
      </div>

      <p className="mate text-lg text-text-subtle mb-8 leading-relaxed">
        {shortDescription || description}
      </p>

      <hr className="border-border/30 mb-8" />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-1 gap-4">
          <CartAction product={product} selectedVariant={selectedVariant} hasSelections={hasSelections} />

          <button className="flex-1 bg-primary text-white teko text-2xl px-4 py-3 rounded-radius-sm shadow-medium hover:bg-primary-light transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Buy Now
          </button>
        </div>
      </div>

      {/* Stock Status */}
      <div className="mb-8 mate text-sm">
        {displayStock && displayStock > 0 ? (
          <div className="flex items-center gap-2 text-success-dark bg-success-light/20 w-max px-4 py-2 rounded-full font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
            In Stock ({displayStock} available)
          </div>
        ) : (
          <div className="flex items-center gap-2 text-danger-dark bg-danger-light/20 w-max px-4 py-2 rounded-full font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
