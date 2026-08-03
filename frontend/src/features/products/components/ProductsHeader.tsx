import { Search } from "lucide-react";
import { useAppSelector } from "../../../app/redux/hook";
import type { Filters } from "../types/Filter.type";
import Select from "./Select";

const ProductsHeader = ({
  filters,
  handleFilterChange,
}: {
  filters: Filters;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}) => {
  const totalProducts = useAppSelector((state) => state.product.totalProducts);

  return (
    <div className="flex justify-between items-center mb-8 gap-5">
      <Select 
       label="Sort by"
       value={filters.sort}
       Name="sort"
       array={["newest", "oldest", "price:asc", "price:desc"]}
       handleOnChange={handleFilterChange}
       />

      {/* Search */}
      <div className="relative w-full max-w-5xl hidden lg:block">
        <input
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="w-full pl-4 pr-10 py-3 bg-white/70 border border-border focus:ring-1 focus:ring-gold rounded-xl text-sm transition-all outline-none shadow-sm"
          placeholder="Search products..."
          type="text"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-border w-4 h-4" />
      </div>
      <p className="text-xs whitespace-nowrap font-semibold text-text-subtle">
        {totalProducts} Products Found
      </p>
    </div>
  );
};

export default ProductsHeader;
