import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import Input from "../product/Form/Input";
import AttributeEditor from "./AttributeEditor";
import type { ProductFormValues } from "./types";
import { useAppSelector } from "../../../../app/redux/hook";
import CreatableSelect from "../product/Form/CreatableSelect";
import { useEffect } from "react";
import OptionsEditor from "./OptionsEditor";
/**
 * Classification section.
 * Fields: brand, category, subCategory (3-col grid), tags, and dynamic attributes.
 */
const ClassificationSection = () => {
  const { register, control, setValue } = useFormContext<ProductFormValues>();
  const enums = useAppSelector((state) => state.product.enums);
  const selectedCategory = useWatch({
    control,
    name: "category",
  });
  useEffect(() => {
    setValue("subCategory", "");
  }, [selectedCategory, setValue]);
  return (
    <div className="space-y-1">
      {/* 3-column grid for brand / category / subCategory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        <CreatableSelect
          options={enums.brands}
          name="brand"
          placeholder="e.g. Handmade Studio"
        />
        <CreatableSelect
          options={enums.categories}
          name="category"
          placeholder="e.g. Bags"
        />
        <CreatableSelect
          options={enums.subCategories
            .filter((s) => {
              return selectedCategory === s.category || !selectedCategory;
            })
            .map((s) => s.name)}
          name="subCategory"
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
