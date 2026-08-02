import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import AttributeEditor from "./AttributeEditor";
import type { ProductFormValues } from "./types";
import { useAppSelector } from "../../../../app/redux/hook";
import CreatableSelect from "react-select/creatable";
import { useState, type ReactHTMLElement } from "react";
/**
 * Classification section.
 * Fields: brand, category, subCategory (3-col grid), tags, and dynamic attributes.
 */
const ClassificationSection = () => {
  const { register } = useFormContext<ProductFormValues>();
  const enums = useAppSelector((state) => state.product.enums);
  const [brand, setBrand] = useState("");
  console.log(enums);

  return (
    <div className="space-y-1">
      {/* 3-column grid for brand / category / subCategory */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        <CreatableSelect
          options={enums.brands.map(e=>({label:e,value:e}))}
          onChange={(option)=>console.log("changed",option)}
          isClearable={true}
          placeholder="Select brand"
          className="bg-background text-text rounded outline-none"
        />
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
