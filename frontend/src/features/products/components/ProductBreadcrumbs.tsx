import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbsProps {
  category?: string;
}

const ProductBreadcrumbs = ({ category }: ProductBreadcrumbsProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto mb-8 animate-fade-in">
      <nav className="flex items-center text-sm font-medium mate text-text-subtle">
        <button
          onClick={() => navigate("/")}
          className="hover:text-primary transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <button
          onClick={() => navigate("/products")}
          className="hover:text-primary transition-colors"
        >
          Shop
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-text-mutes capitalize">
          {category || "Product"}
        </span>
      </nav>
    </div>
  );
};

export default ProductBreadcrumbs;
