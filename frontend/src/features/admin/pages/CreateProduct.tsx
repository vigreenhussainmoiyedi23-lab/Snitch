import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

// ── Business logic (preserved) ──────────────────────────────
import { useProduct } from "../../products/hook/useProduct";
import { useAppSelector } from "../../../app/redux/hook";
import ShowError from "../../../commonComponents/ShowError";

// ── Section components ──────────────────────────────────────
import SectionCard from "../components/CreateProduct/SectionCard";
import ImageUploader from "../components/CreateProduct/ImageUploader";
import BasicInformation from "../components/CreateProduct/BasicInformation";
import PricingSection from "../components/CreateProduct/PricingSection";
import InventorySection from "../components/CreateProduct/InventorySection";
import ClassificationSection from "../components/CreateProduct/ClassificationSection";
import ShippingSection from "../components/CreateProduct/ShippingSection";
import SEOSection from "../components/CreateProduct/SEOSection";
import PublishingSection from "../components/CreateProduct/PublishingSection";
import SummaryCard from "../components/CreateProduct/SummaryCard";
import type { ProductFormValues } from "../components/CreateProduct/types";

// ── Submit button ─────────────────────────────────────────────

type SubmitBtnProps = {
  isSubmitting: boolean;
  size?: "sm" | "lg";
  form?: string;
};

const SubmitButton = ({ isSubmitting, size = "lg", form }: SubmitBtnProps) => (
  <button
    type="submit"
    form={form}
    disabled={isSubmitting}
    aria-disabled={isSubmitting}
    className={`teko tracking-wider text-white rounded-full flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${size === "sm"
      ? "text-base px-7 py-2"
      : "text-xl px-14 py-3 w-full sm:w-auto"
      }`}
    style={{
      background:
        "linear-gradient(135deg, var(--color-primary-light), var(--color-primary-dark))",
      boxShadow: "0 6px 20px rgba(247, 136, 13, 0.35)",
    }}
  >
    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
    {isSubmitting ? "Creating…" : "Create Product"}
  </button>
);

// ── Root component ────────────────────────────────────────────

/**
 * CreateProduct — composition root.
 *
 * Responsibilities:
 *  • useForm / FormProvider setup
 *  • images state
 *  • SubmitHandler (FormData build + API call)
 *  • Layout composition
 *
 * All UI is delegated to focused child components.
 * All original field names, API calls, and Redux logic are preserved.
 */
const CreateProduct = () => {
  // ── Business logic (unchanged) ──────────────────────────
  const { createProductHandler } = useProduct();
  const [images, setImages] = useState<File[]>([]);
  const error = useAppSelector((state) => state.product.error);

  const methods = useForm<ProductFormValues>({
    defaultValues: {
      discount: 0,
      currency: "INR",
      status: "published",
      visibility: "public",
      isFeatured: false,
      attributes: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const SubmitHandler = async (data: ProductFormValues) => {
    const formData = new FormData();
    
    // Separate the attributes array from scalar fields
    const { attributes, ...scalarFields } = data;
  

    // Append all scalar fields (skip empty optionals to avoid polluting the backend)
    Object.entries(scalarFields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Serialize valid attribute pairs as JSON
    if (attributes?.length > 0) {
      const validAttrs = attributes.filter((a) => a.key.trim() !== "");
      if (validAttrs.length > 0) {
        const object = validAttrs.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as Record<string, string>)
        formData.append("attributes", JSON.stringify(object));
      }
    }

    // Append images (original logic preserved)
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await createProductHandler(formData);
      reset();
      setImages([]);
    } catch (_) {
      // Error already handled + dispatched inside createProductHandler
    }
  };

  const handleCancel = () => {
    reset();
    setImages([]);
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Page Header ── */}
      <header
        className="bg-text  border-b border-background-light sticky top-0 z-20"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="eczar text-xl md:text-2xl font-bold text-background leading-tight">
              Create Product
            </h1>
            <p className="mate text-xs text-background-light mt-0.5 hidden sm:block">
              Add a new product to your store
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="teko text-base tracking-wider px-5 py-2 rounded-full border border-border text-background-light hover:border-primary hover:text-primary transition-colors duration-150 hidden sm:block"
            >
              Cancel
            </button>
            <SubmitButton isSubmitting={isSubmitting} size="sm" form="create-product-form" />
          </div>
        </div>
      </header>

      {/* ── Form ── */}
      <FormProvider {...methods}>
        <form
          id="create-product-form"
          onSubmit={handleSubmit(SubmitHandler)}
          noValidate
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {/* ── Two-column responsive grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Left column (2/3) ── */}
              <div className="lg:col-span-2 space-y-6">
                <SectionCard
                  number={1}
                  title="Product Images"
                  subtitle="Upload up to 5 images. The first image will be the cover."
                >
                  <ImageUploader images={images} setImages={setImages} />
                </SectionCard>

                <SectionCard
                  number={2}
                  title="Basic Information"
                  subtitle="Product name, short pitch and full description."
                >
                  <BasicInformation />
                </SectionCard>

                <SectionCard
                  number={3}
                  title="Classification"
                  subtitle="Brand, category, tags and custom attributes."
                >
                  <ClassificationSection />
                </SectionCard>
              </div>

              {/* ── Right column (1/3) ── */}
              <div className="lg:col-span-1 space-y-6">
                <SectionCard
                  number={4}
                  title="Pricing"
                  subtitle="Set MRP, discount percentage and currency."
                >
                  <PricingSection />
                </SectionCard>

                <SectionCard
                  number={5}
                  title="Inventory"
                  subtitle="Stock level, barcode and low-stock alert."
                >
                  <InventorySection />
                </SectionCard>

                <SectionCard
                  number={6}
                  title="Shipping"
                  subtitle="Physical dimensions used for shipping rates."
                >
                  <ShippingSection />
                </SectionCard>

                <SectionCard
                  number={7}
                  title="SEO"
                  subtitle="Boost discoverability in search engines."
                >
                  <SEOSection />
                </SectionCard>

                <SectionCard
                  number={8}
                  title="Publishing"
                  subtitle="Status, visibility and featured flag."
                >
                  <PublishingSection />
                </SectionCard>

                {/* Visual-only live summary */}
                <SummaryCard imageCount={images.length} />
              </div>
            </div>

            {/* ── Error display ── */}
            {error && (
              <div className="mt-6">
                <ShowError error={error} />
              </div>
            )}

            {/* ── Bottom action bar ── */}
            <div className="mt-10 pt-6 border-t border-background-light flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="teko text-lg tracking-wider w-full sm:w-auto px-10 py-3 rounded-full border border-border text-text-subtle hover:border-primary hover:text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <SubmitButton isSubmitting={isSubmitting} size="lg" />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateProduct;
