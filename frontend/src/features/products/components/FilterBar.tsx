import { Search, X } from "lucide-react";
import type { Filters } from "../types/Filter.type";

const FilterBar = (data: {
  filters: Filters;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  handleApplyFilters: () => void;
}) => {
  const {
    filters,
    handleFilterChange,
    toggleSidebar,
    sidebarOpen,
    handleApplyFilters,
  } = data;
  return (
    <aside
      className={`fixed inset-0 z-60 bg-black/40 md:bg-transparent md:relative md:inset-auto md:z-0 ${sidebarOpen ? "block" : "hidden md:block"} transition-all`}
    >
      <div className="h-full w-80 md:w-64 bg-background md:bg-transparent p-6 md:p-0 flex flex-col gap-8 overflow-y-auto rounded-r-2xl md:rounded-none shadow-2xl md:shadow-none">
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-2xl font-semibold text-primary">Filters</h2>
          <button className="p-2" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Search
          </label>
          <div className="relative">
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-4 pr-10 py-3 bg-white/50 border-none focus:ring-1 focus:ring-gold rounded-xl text-sm transition-all outline-none shadow-sm"
              placeholder="Search products..."
              type="text"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-border w-4 h-4" />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Category
          </label>
          <div className="flex flex-col gap-3">
            {["crochet", "Frontend", "Lighting", "Furniture"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  name="cat"
                  value={cat}
                  checked={filters.cat === cat}
                  onChange={handleFilterChange}
                  className="w-5 h-5 rounded border-border/30 accent-gold focus:ring-gold transition-all"
                />
                <span
                  className={`text-sm transition-colors ${filters.cat === cat ? "text-primary font-semibold" : "group-hover:text-primary text-text-subtle"}`}
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-border/10" />

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
              className="w-full py-2 px-3 bg-white/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-gold shadow-sm outline-none"
              placeholder="Min"
              type="number"
            />
            <span className="text-border">—</span>
            <input
              name="Uprice"
              value={filters.Uprice}
              onChange={handleFilterChange}
              className="w-full py-2 px-3 bg-white/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-gold shadow-sm outline-none"
              placeholder="Max"
              type="number"
            />
          </div>
        </div>

        <hr className="border-border/10" />

        {/* Brands */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
            Brand
          </label>
          <div className="flex flex-col gap-3">
            {["handMade", "Knoll", "Muuto", "Herman Miller"].map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={handleFilterChange}
                  className="w-5 h-5 rounded border-border/30 accent-gold focus:ring-gold transition-all"
                />
                <span
                  className={`text-sm transition-colors ${filters.brand === brand ? "text-primary font-semibold" : "group-hover:text-primary text-text-subtle"}`}
                >
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

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
