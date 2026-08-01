import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useAppSelector } from "../../../app/redux/hook";
import {
  ShoppingCart,
  Menu,
} from "lucide-react";
import Pagination from "../components/Pagination";
import type { Filters } from "../types/Filter.type";
import FilterBar from "../components/FilterBar";

const Products = () => {
  const { GetAllProducts } = useProduct();
  const productsResponse = useAppSelector((state) => state.product.products);

  const products = Array.isArray(productsResponse)
    ? productsResponse
    : (productsResponse as any)?.products || [];
  const totalPages = useAppSelector((state) => state.product.totalPages);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20,
    cat: "",
    brand: "",
    search: "",
    Uprice: 0,
    Lprice: 0,
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      GetAllProducts(filters);
    }, 750);

    return () => clearTimeout(timeout);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? value : "",
        page: 1,
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  const handleApplyFilters = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="max-w-7xl mx-auto px-4 md:px-12 mt-8 mb-16">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 bg-background border border-border/30 rounded-2xl shadow-md text-text-subtle font-semibold active:scale-95 transition-all"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
            Filter & Sort
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar (Filter) */}
          <FilterBar
            filters={filters}
            handleFilterChange={handleFilterChange}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            handleApplyFilters={handleApplyFilters}
          />

          {/* Main Content: Product Grid */}
          <section className="flex-1">

            <div className="flex justify-between items-baseline mb-8">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text capitalize">
                {filters.cat || "All Products"}
              </h2>
              <p className="text-xs font-semibold text-text-subtle">
                {products.length} Products Found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <article
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-[0_6px_24px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgb(0,0,0,0.18)] relative flex flex-col"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-background">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/400x500"
                      }
                      alt={product.title}
                    />

                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {product.tags?.includes("premium") && (
                        <span className="px-3 py-1 bg-gold text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          Premium
                        </span>
                      )}
                      {product.tags?.includes("new") && (
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                          New
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button - Desktop */}
                    <div className="opacity-0 md:group-hover:opacity-100 absolute bottom-4 inset-x-4 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <button className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-text-subtle uppercase tracking-widest mb-1">
                      {product.category}
                    </p>
                    <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-text-subtle/80 line-clamp-2 mb-4 flex-1">
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
                  </div>

                  {/* Quick Add Button - Mobile */}
                  <button className="md:hidden w-full bg-background hover:bg-primary hover:text-white text-primary py-4 font-bold flex items-center justify-center gap-2 transition-colors border-t border-border/10">
                    <ShoppingCart className="w-5 h-5" />
                    Quick Add
                  </button>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination
                totalPages={totalPages}
                filters={filters}
                setFilters={setFilters}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Products;
