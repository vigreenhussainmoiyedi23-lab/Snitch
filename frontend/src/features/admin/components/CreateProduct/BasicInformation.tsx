import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import TextArea from "../product/Form/TextArea";
import type { ProductFormValues } from "./types";

/**
 * Basic Information section.
 * Consumes register from FormProvider context — no prop drilling.
 * Fields: title, shortDescription, description.
 */
const BasicInformation = () => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-1">
      <Input
        register={register}
        name="title"
        type="text"
        placeholder="e.g. Handmade Crochet Tote Bag"
      />
      <Input
        register={register}
        name="shortDescription"
        type="text"
        placeholder="Brief one-liner about your product"
        minLength={10}
      />
      <TextArea
        register={register}
        name="description"
        placeholder="Write a detailed product description — materials, dimensions, use cases..."
        isRequired={true}
        minLength={20}
      />
    </div>
  );
};

export default BasicInformation;
