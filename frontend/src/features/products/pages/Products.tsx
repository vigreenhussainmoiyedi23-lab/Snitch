import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useAppSelector } from "../../../app/redux/hook";
import { Menu } from "lucide-react";
import Pagination from "../components/Pagination";
import type { Filters } from "../types/Filter.type";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import ProductsHeader from "../components/ProductsHeader";

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
    limit: 12,
    cat: "",
    brand: "",
    search: "",
    Uprice: 0,
    Lprice: 0,
    subCategory: "",
    sort: "newest",
  });
  useEffect(() => {
    const timeout = setTimeout(() => {
      GetAllProducts(filters);
    }, 750);

    return () => clearTimeout(timeout);
  }, [filters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      let checked = e.target.checked;
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
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      cat: "",
      brand: "",
      search: "",
      Uprice: 0,
      Lprice: 0,
      subCategory: "",
      sort: "newest",
    });
  };
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <main className="max-w-7xl mx-auto px-4 md:px-12 mt-8 mb-16 h-full">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-6 sticky top-25 z-30">
          <button
            className="w-full bg-gold-dark flex items-center justify-center gap-2 py-3  border border-border/30 rounded-2xl shadow-md text-white font-semibold active:scale-95 transition-all"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
            Filter & Sort
          </button>
        </div>

        <div className="flex flex-col relative  md:flex-row gap-6 h-full ">
          {/* Left Sidebar (Filter) */}
          <FilterBar
            clearFilters={clearFilters}
            filters={filters}
            handleFilterChange={handleFilterChange}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            handleApplyFilters={handleApplyFilters}
          />

          {/* Main Content: Product Grid */}
          <section className="flex-1">
            <ProductsHeader
              filters={filters}
              handleFilterChange={handleFilterChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <div className="flex items-center justify-center h-96 w-full">
                <p className="text-2xl font-semibold text-primary text-center">
                  No products found ...
                </p>
              </div>
            )}

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
