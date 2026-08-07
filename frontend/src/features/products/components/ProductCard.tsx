import { ShoppingBag } from "lucide-react";
import type { product } from "../types/product.type";
import { Link, useNavigate } from "react-router-dom";
import CartAction from "../../cart/components/CartAction";
const ProductCard = ({ product }: { product: product }) => {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/product/${product.slug}`);
  }

  return (
    <article
      key={product._id}
      className="group bg-white rounded-2xl shadow-[0_6px_24px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] relative flex flex-col"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-background">
        <div onClick={handleClick} className="w-full h-full">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={
              product.images?.[0]?.url || "https://via.placeholder.com/400x500"
            }
            loading="lazy"
            alt={product.title}
          />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {product.tags?.map((tag, idx) => (
              <span
                className={
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm " +
                  ((idx & 1) === 0
                    ? "bg-gold  text-white"
                    : "bg-white text-text")
                }
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Add Button - Desktop */}

      <Link
        to={`/product/${product.slug}`}
        className="p-5 flex-1 flex flex-col"
      >
        <p className="text-xs text-text uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-sm text-text/80 line-clamp-2 mb-4 flex-1">
          {product.shortDescription || product.description}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <span className="text-xl font-bold text-primary">
            {product.currency === "INR" ? "₹" : "$"}
            {product.finalPrice}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-border/50 line-through font-medium">
              {product.currency === "INR" ? "₹" : "$"}
              {product.mrp}
            </span>
          )}
        </div>
      </Link>
      <div className="z-5 py-3 px-1 flex gap-2 flex-wrap">
        <CartAction product={product} />
        <button className="w-full hover:-translate-y-1  transition-all ease-in-out bg-white hover:bg-white/90 text-primary border border-border py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95  whitespace-nowrap">
          <ShoppingBag className="w-5 h-5" />
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
