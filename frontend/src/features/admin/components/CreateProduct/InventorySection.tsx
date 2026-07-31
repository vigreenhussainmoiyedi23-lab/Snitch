import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import type { ProductFormValues } from "./types";

/**
 * Inventory section.
 * Fields: barcode, stock, lowStockThreshold.
 * SKU is intentionally omitted — generated automatically by the backend.
 */
const InventorySection = () => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-1">
      <Input
        register={register}
        name="barcode"
        type="text"
        placeholder="e.g. 8906123456789"
        isRequired={false}
      />
      <Input
        register={register}
        name="stock"
        type="number"
        placeholder="0"
      />
      <Input
        register={register}
        name="lowStockThreshold"
        type="number"
        placeholder="5"
        isRequired={false}
      />
    </div>
  );
};

export default InventorySection;
