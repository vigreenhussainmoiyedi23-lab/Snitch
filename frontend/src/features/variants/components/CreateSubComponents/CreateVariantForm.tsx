import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react";
import PriceInputs from "./PriceInputs";
import AttributeInputRow from "./AttributeInputRow";
import ImageUploadSection from "./ImageUploadSection";

interface CreateVariantFormProps {
  show: boolean;
  onToggle: () => void;
  form: {
    mrp: string;
    discount: string;
    stock: string;
    attributes: { key:string; value: string }[];
    images: File[];
  };
  previews: string[];
  fileError: string;
  loading: boolean;
  onFormChange: (form: any) => void;
  onImagesChange: (files: File[]) => void;
  onFileErrorChange: (error: string) => void;
  onPreviewsChange: (previews: string[]) => void;
  onSubmit: () => void;
}

const CreateVariantForm: React.FC<CreateVariantFormProps> = ({
  show,
  onToggle,
  form,
  previews,
  fileError,
  loading,
  onFormChange,
  onImagesChange,
  onFileErrorChange,
  onPreviewsChange,
  onSubmit,
}) => {
  const handleImagesChange = (files: File[]) => {
    onImagesChange(files);
    onPreviewsChange(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (i: number) => {
    onFormChange({
      ...form,
      images: form.images.filter((_, idx) => idx !== i),
    });
    onPreviewsChange(previews.filter((_, idx) => idx !== i));
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-radius-sm teko text-xl tracking-wider shadow-soft hover:bg-primary-light active:scale-95 transition-all"
      >
        <Plus className="w-4 h-4" />
        Create Variant
        {show ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        )}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-border/40 rounded-radius-md p-5 bg-background-light/30 space-y-4">
              <h4 className="teko text-2xl text-text tracking-wider">
                New Variant
              </h4>
              
              <PriceInputs
                mrp={form.mrp}
                discount={form.discount}
                stock={form.stock}
                onMrpChange={(val) => onFormChange({ ...form, mrp: val })}
                onDiscountChange={(val) => onFormChange({ ...form, discount: val })}
                onStockChange={(val) => onFormChange({ ...form, stock: val })}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="mate text-xs text-text-subtle">
                    Attributes
                  </label>
                  <button
                    onClick={() =>
                      onFormChange({
                        ...form,
                        attributes: [...form.attributes, { key: "", value: "" }],
                      })
                    }
                    className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-2">
                  {form.attributes.map((attr, idx) => (
                    <AttributeInputRow
                      key={idx}
                      keyValue={attr.key}
                      value={attr.value}
                      onKeyChange={(val) =>
                        onFormChange({
                          ...form,
                          attributes: form.attributes.map((a, i) =>
                            i === idx ? { ...a, key: val } : a,
                          ),
                        })
                      }
                      onValueChange={(val) =>
                        onFormChange({
                          ...form,
                          attributes: form.attributes.map((a, i) =>
                            i === idx ? { ...a, value: val } : a,
                          ),
                        })
                      }
                      onRemove={() =>
                        onFormChange({
                          ...form,
                          attributes: form.attributes.filter((_, i) => i !== idx),
                        })
                      }
                      showRemove={form.attributes.length > 1}
                    />
                  ))}
                </div>
              </div>

              <ImageUploadSection
                previews={previews}
                fileError={fileError}
                onFilesChange={handleImagesChange}
                onFileErrorChange={onFileErrorChange}
                onRemovePreview={removePreview}
              />

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Create Variant
                </button>
                <button
                  onClick={onToggle}
                  className="px-5 border border-border/50 text-text-subtle rounded-radius-sm hover:bg-background-light active:scale-95 transition-all mate text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateVariantForm;
