import { useFormContext, useWatch } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import Input from "../product/Form/Input";
import type { ProductFormValues } from "./types";

const CURRENCIES = [
  { code: "INR", label: "INR (₹)" },
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
];

/** Styled select with chevron — cream on dark card. */
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
 * Pricing section.
 * Final Price display box uses bg-text-subtle for depth within the dark card.
 */
const PricingSection = () => {
  const { register } = useFormContext<ProductFormValues>();

  const price = useWatch<ProductFormValues, "price">({ name: "price" });
  const discount = useWatch<ProductFormValues, "discount">({ name: "discount" });

  const mrp = Number(price) || 0;
  const disc = Math.min(Math.max(Number(discount) || 0, 0), 100);
  const finalPrice = mrp > 0 ? mrp - (mrp * disc) / 100 : 0;

  return (
    <div className="space-y-1">
      <Input register={register} name="price" type="number" placeholder="0.00" />

      <Input
        register={register}
        name="discount"
        type="number"
        placeholder="0"
        isRequired={false}
        min={0}
        max={100}
        defaultValue={0}
      />

      {/* Live Final Price — inset panel on dark card */}
      {mrp > 0 && (
        <div className="rounded-lg bg-text-subtle border border-border p-4 mt-2">
          <p className="mate text-[11px] text-background-subtle uppercase tracking-wider mb-1.5">
            Calculated Final Price
          </p>
          <div className="flex items-baseline gap-3">
            <p className="eczar text-2xl font-bold text-success">
              ₹{finalPrice.toFixed(2)}
            </p>
            {disc > 0 && (
              <p className="mate text-sm text-background-subtle line-through">
                ₹{mrp.toFixed(2)}
              </p>
            )}
          </div>
          {disc > 0 && (
            <p className="mate text-xs text-primary mt-1">{disc}% discount applied</p>
          )}
        </div>
      )}

      {/* Currency */}
      <div className="mt-2">
        <FormSelect id="currency" label="currency" {...register("currency")} defaultValue="INR">
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </FormSelect>
      </div>
    </div>
  );
};

export default PricingSection;
