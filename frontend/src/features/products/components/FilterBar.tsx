import { Search, X } from "lucide-react";
import type { Filters } from "../types/Filter.type";
import { useAppSelector } from "../../../app/redux/hook";
import Select from "./Select";

const FilterBar = (data: {
  filters: Filters;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  handleApplyFilters: () => void;
  clearFilters: () => void;
}) => {
  const {
    filters,
    handleFilterChange,
    toggleSidebar,
    sidebarOpen,
    handleApplyFilters,
    clearFilters,
  } = data;
  const enums = useAppSelector((state) => state.product.enums);
  return (
    <aside
      className={`fixed top-0 left-0 h-screen  inset-0 z-60 bg-black/40 md:bg-transparent md:relative md:inset-auto md:z-0 ${sidebarOpen ? "block" : "hidden md:block"} transition-all`}
    >
      <div className="h-full w-80 md:w-64 bg-background md:bg-transparent p-6 md:p-0 flex flex-col  gap-4 overflow-y-auto rounded-r-2xl md:rounded-none shadow-2xl md:shadow-none">
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-2xl font-semibold text-primary">Filters</h2>
          <button className="p-2" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-primary hidden md:block">
          Filters
        </h2>
        <hr />
        {/* Search */}
        <div className="space-y-3  block lg:hidden">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Search
          </label>
          <div className="relative">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-4 pr-10 py-3 bg-white/70 border border-border focus:ring-1 focus:ring-gold rounded text-sm transition-all outline-none shadow-sm"
              placeholder="Search products..."
              type="text"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-border w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Categories */}
          <Select
            label="Category"
            array={enums.categories}
            value={filters.cat}
            handleOnChange={handleFilterChange}
            Name="cat"
          />

          {/* Brands */}
          <Select
            label="Brand"
            Name="brand"
            array={enums.brands}
            value={filters.brand!}
            handleOnChange={handleFilterChange}
          />
          {/* SubCategories */}
          <Select
            label="SubCategory"
            Name="subCategory"
            array={enums.subCategories}
            value={filters.subCategory!}
            handleOnChange={handleFilterChange}
          />
          <Select
            label="Sort by"
            value={filters.sort}
            Name="sort"
            array={["newest", "oldest", "price:asc", "price:desc"]}
            handleOnChange={handleFilterChange}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              name="Lprice"
              value={filters.Lprice}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 bg-white/70 border border-border rounded text-sm focus:ring-1 focus:ring-gold shadow-sm outline-none"
              placeholder="Min"
              type="number"
            />
            <span className="text-border">—</span>
            <input
              name="Uprice"
              value={filters.Uprice}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 bg-white/70 border border-border rounded text-sm focus:ring-1 focus:ring-gold shadow-sm outline-none"
              placeholder="Max"
              type="number"
            />
          </div>
          <button
            onClick={clearFilters}
            className="mt-auto bg-gold text-white w-full py-4 rounded-xl font-bold active:scale-95 transition-all shadow-md hover:bg-gold-light"
          >
            Clear Filters
          </button>
        </div>

        <hr className="border-border/10" />

        <button
          onClick={handleApplyFilters}
          className="md:hidden mt-auto bg-primary text-white w-full py-4 rounded-xl font-bold active:scale-95 transition-all shadow-md hover:bg-primary-light"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterBar;
