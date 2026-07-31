import { useFormContext } from "react-hook-form";
import Input from "../product/Form/Input";
import TextArea from "../product/Form/TextArea";
import type { ProductFormValues } from "./types";

/**
 * SEO section.
 * Fields: metaTitle, metaDescription, keywords.
 * Includes helper text for better UX guidance.
 * All fields are optional.
 */
const SEOSection = () => {
  const { register } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-1">
      <Input
        register={register}
        name="metaTitle"
        type="text"
        placeholder="Product Name — Brand | Store"
        isRequired={false}
        maxLength={70}
      />
      <p className="mate text-[11px] text-background-light -mt-2 mb-3 px-1">
        Recommended: 50–70 characters for best results.
      </p>

      <TextArea
        register={register}
        name="metaDescription"
        placeholder="Describe the product for search engines in 1–2 sentences..."
        isRequired={false}
        minLength={10}
      />
      <p className="mate text-[11px] text-background-light -mt-2 mb-3 px-1">
        Aim for 120–160 characters.
      </p>

      <Input
        register={register}
        name="keywords"
        type="text"
        placeholder="keyword1, keyword2, keyword3"
        isRequired={false}
      />
      <p className="mate text-[11px] text-background-light px-1">
        Separate keywords with commas for better search indexing.
      </p>
    </div>
  );
};

export default SEOSection;
