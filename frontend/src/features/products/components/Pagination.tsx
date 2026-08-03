import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Filters } from "../types/Filter.type";
import { useState } from "react";
const Pagination = (data: {
  totalPages: number;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="mt-16 flex justify-center items-center gap-4">
      <button
        onClick={() => {
          setIsClicked(true);
          data.setFilters((prev) => ({
            ...prev,
            page: Math.max(1, prev.page - 1),
          }));
          setTimeout(() => {
            setIsClicked(false);
          }, 500);
        }}
        style={{
          opacity: data.filters.page === 1 ? 0.4 : 1,
          cursor: data.filters.page === 1 || isClicked ? "not-allowed" : "auto",
        }}
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
        onClick={() => {
          setIsClicked(true);
          data.setFilters((prev) => ({
            ...prev,
            page: Math.min(prev.page + 1, data.totalPages),
          }));
          setTimeout(() => {
            setIsClicked(false);
          }, 500);
        }}
        style={{
          opacity: data.filters.page === data.totalPages ? 0.4 : 1,
          cursor:
            data.filters.page === data.totalPages || isClicked
              ? "not-allowed"
              : "auto",
        }}
        disabled={data.filters.page === data.totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-full border border-border/30 text-border hover:border-primary hover:text-primary hover:shadow-md transition-all bg-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
