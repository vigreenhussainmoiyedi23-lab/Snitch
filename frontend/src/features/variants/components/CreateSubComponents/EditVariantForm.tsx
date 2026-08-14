import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Loader2, X } from "lucide-react";
import PriceInputs from "./PriceInputs";
import AttributeInputRow from "./AttributeInputRow";
import ImageUploadSection from "./ImageUploadSection";

interface EditVariantFormProps {
  variant: any;
  form: {
    mrp: string;
    discount: string;
    stock: string;
    attributes: { key: string; value: string }[];
    newImages: File[];
    keepFileIds: string[];
  };
  previews: string[];
  fileError: string;
  loading: boolean;
  onFormChange: (form: any) => void;
  onImagesChange: (files: File[]) => void;
  onFileErrorChange: (error: string) => void;
  onPreviewsChange: (previews: string[]) => void;
  onToggleKeep: (fileId: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const EditVariantForm: React.FC<EditVariantFormProps> = ({
  variant,
  form,
  previews,
  fileError,
  loading,
  onFormChange,
  onImagesChange,
  onFileErrorChange,
  onPreviewsChange,
  onToggleKeep,
  onCancel,
  onSubmit,
}) => {
  const handleImagesChange = (files: File[]) => {
    onImagesChange(files);
    onPreviewsChange(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (i: number) => {
    onFormChange({
      ...form,
      newImages: form.newImages.filter((_, idx) => idx !== i),
    });
    onPreviewsChange(previews.filter((_, idx) => idx !== i));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div className="border-t border-border/20 p-4 bg-background-light/20 space-y-4">
          <h5 className="teko text-xl text-text tracking-wider">
            Edit Variant
          </h5>

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
                  keyPlaceholder="Key"
                  valuePlaceholder="Value"
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

          <div>
            {variant.images?.length > 0 && (
              <div className="mb-3">
                <label className="mate text-xs text-text-subtle block mb-2">
                  Current Images{" "}
                  <span className="text-text-subtle/60">
                    (click to keep/remove)
                  </span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {variant.images.map((img: any) => {
                    const kept = form.keepFileIds.includes(img.fileId);
                    return (
                      <div
                        key={img.fileId}
                        onClick={() => onToggleKeep(img.fileId)}
                        className={`relative w-16 h-16 rounded-radius-sm overflow-hidden border-2 cursor-pointer transition-all ${kept ? "border-primary opacity-100" : "border-transparent opacity-40"}`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {!kept && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <X className="w-5 h-5 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <ImageUploadSection
              label="Add New Images"
              buttonText="+ Upload new images"
              compact
              previews={previews}
              fileError={fileError}
              onFilesChange={handleImagesChange}
              onFileErrorChange={onFileErrorChange}
              onRemovePreview={removePreview}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-gold-dark text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="px-5 border border-border/50 text-text-subtle rounded-radius-sm hover:bg-background-light transition-all mate text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditVariantForm;
