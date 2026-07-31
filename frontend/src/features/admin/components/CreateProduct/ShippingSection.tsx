import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import type { ProductFormValues } from "./types";

/**
 * Shipping section.
 * Fields: weight, length, width, height — arranged in a 2-column grid.
 * All fields are optional.
 */
const ShippingSection = () => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <div className="grid grid-cols-2 gap-x-4">
      <Input
        register={register}
        name="weight"
        type="text"
        placeholder="e.g. 0.500 kg"
        isRequired={false}
      />
      <Input
        register={register}
        name="length"
        type="text"
        placeholder="e.g. 30 cm"
        isRequired={false}
      />
      <Input
        register={register}
        name="width"
        type="text"
        placeholder="e.g. 15 cm"
        isRequired={false}
      />
      <Input
        register={register}
        name="height"
        type="text"
        placeholder="e.g. 28 cm"
        isRequired={false}
      />
    </div>
  );
};

export default ShippingSection;
