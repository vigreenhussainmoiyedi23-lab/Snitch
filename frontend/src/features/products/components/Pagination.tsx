import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Filters } from "../types/Filter.type";
const Pagination = (data: {
  totalPages: number;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  return (
    <div className="mt-16 flex justify-center items-center gap-4">
      <button
        onClick={() =>
          data.setFilters((prev) => ({
            ...prev,
            page: Math.max(1, prev.page - 1),
          }))
        }
        className="w-12 h-12 flex items-center justify-center rounded-full border border-border/30 text-border hover:border-primary hover:text-primary hover:shadow-md transition-all bg-white"
        disabled={data.filters.page === 1}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      {data.filters.page - 1 > 0 && (
        <span className="text-sm font-semibold text-primary bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">
          {data.filters.page - 1}
        </span>
      )}
      <span className="text-sm font-semibold text-primary bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">
        {data.filters.page}
      </span>
      {data.filters.page + 1 <= data.totalPages && (
        <span className="text-sm font-semibold text-primary bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-sm">
          {data.filters.page + 1}
        </span>
      )}
      <button
        onClick={() =>
          data.setFilters((prev) => ({
            ...prev,
            page: Math.min(prev.page + 1, data.totalPages),
          }))
        }
        className="w-12 h-12 flex items-center justify-center rounded-full border border-border/30 text-border hover:border-primary hover:text-primary hover:shadow-md transition-all bg-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
