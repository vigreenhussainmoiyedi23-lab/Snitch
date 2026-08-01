import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useAppSelector } from "../../../app/redux/hook";
import {  Menu } from "lucide-react";
import Pagination from "../components/Pagination";
import type { Filters } from "../types/Filter.type";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";

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
                <ProductCard key={product._id} product={product} />
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
