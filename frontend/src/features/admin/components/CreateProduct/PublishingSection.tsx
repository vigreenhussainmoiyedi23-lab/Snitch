import { useFormContext } from "react-hook-form";
import { ChevronDown, Check } from "lucide-react";
import type { ProductFormValues } from "./types";

// ── Reusable styled select ────────────────────────────────

const FormSelect = ({
  id,
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <div>
    <label
      htmlFor={id}
      className="text-primary-lighter w-full capitalize text-[10px] md:text-xs font-serif tracking-[3px] text-start block mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        {...props}
        className="w-full h-11 appearance-none bg-background border border-border text-text text-sm rounded-lg px-3 pr-9 outline-none cursor-pointer mate transition-all duration-200 hover:border-primary-lighter focus:border-primary focus:shadow-[0_0_0_3px_rgba(247,136,13,0.12)]"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-border" />
    </div>
  </div>
);

/**
 * Publishing section.
 * All text adapted for dark card (bg-text) context.
 */
const PublishingSection = () => {
  const { register, watch } = useFormContext<ProductFormValues>();
  const isFeatured = watch("isFeatured");

  return (
    <div className="space-y-4">
      {/* Status */}
      <FormSelect id="status" label="status" {...register("status")} defaultValue="published">
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </FormSelect>

      {/* Visibility */}
      <FormSelect id="visibility" label="visibility" {...register("visibility")} defaultValue="public">
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="unlisted">Unlisted</option>
      </FormSelect>

      {/* Featured Product checkbox */}
      <label
        htmlFor="isFeatured"
        className="flex items-start gap-3 cursor-pointer group p-3 rounded-lg hover:bg-text-subtle transition-colors duration-150"
      >
        {/* Hidden real checkbox — preserves register("isFeatured") binding */}
        <input
          id="isFeatured"
          {...register("isFeatured")}
          type="checkbox"
          className="sr-only peer"
        />

        {/* Visual checkbox box */}
        <span
          className={`mt-0.5 w-[18px] h-[18px] flex-shrink-0 rounded flex items-center justify-center border-2 transition-all duration-200 ${
            isFeatured
              ? "bg-primary border-primary"
              : "bg-transparent border-border group-hover:border-primary-lighter"
          }`}
        >
          <Check
            className={`w-3 h-3 text-white transition-opacity duration-150 ${
              isFeatured ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>

        {/* Label text — cream on dark */}
        <div>
          <p className="mate text-sm font-semibold text-background group-hover:text-primary transition-colors duration-150">
            Featured Product
          </p>
          <p className="mate text-xs text-background-subtle leading-relaxed mt-0.5">
            Display this product in featured sections and homepage highlights.
          </p>
        </div>
      </label>
    </div>
  );
};

export default PublishingSection;
