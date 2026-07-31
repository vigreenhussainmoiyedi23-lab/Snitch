import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import AttributeEditor from "./AttributeEditor";
import type { ProductFormValues } from "./types";

/**
 * Classification section.
 * Fields: brand, category, subCategory (3-col grid), tags, and dynamic attributes.
 */
const ClassificationSection = () => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-1">
      {/* 3-column grid for brand / category / subCategory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        <Input
          register={register}
          name="brand"
          type="text"
          placeholder="e.g. Handmade Studio"
        />
        <Input
          register={register}
          name="category"
          type="text"
          placeholder="e.g. Bags"
        />
        <Input
          register={register}
          name="subCategory"
          type="text"
          placeholder="e.g. Tote Bags"
        />
      </div>

      {/* Tags */}
      <Input
        register={register}
        name="tags"
        type="text"
        placeholder="handmade, crochet, tote, women — separate with commas"
        isRequired={false}
        defaultValue=""
      />

      {/* Attributes */}
      <div className="pt-3">
        <p className="text-primary-lighter capitalize text-[10px] md:text-xs font-serif tracking-[3px] mb-3">
          attributes
        </p>
        <AttributeEditor />
      </div>
    </div>
  );
};

export default ClassificationSection;
