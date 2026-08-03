import { ShoppingCart } from "lucide-react";
import type { product } from "../types/product.type";
import { Link, useNavigate } from "react-router-dom";
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
            {product.tags?.map(
              (tag, idx) =>
                (idx & 1) === 0 && (
                  <span className="px-3 py-1 bg-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {tag}
                  </span>
                ),
            )}
            {product.tags?.map(
              (tag, idx) =>
                (idx & 1) !== 0 && (
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {tag}
                  </span>
                ),
            )}
          </div>
        </div>

        {/* Quick Add Button - Desktop */}
        <div className="opacity-0 z-10 md:group-hover:opacity-100 absolute bottom-4 inset-x-4 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      <Link to={`/product/${product.slug}`} className="p-5 flex-1 flex flex-col">
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

      {/* Quick Add Button - Mobile */}
      <button className="md:hidden w-full z-10 bg-background hover:bg-primary hover:text-white text-primary py-4 font-bold flex items-center justify-center gap-2 transition-colors border-t border-border/10">
        <ShoppingCart className="w-5 h-5" />
        Quick Add
      </button>
    </article>
  );
};

export default ProductCard;
