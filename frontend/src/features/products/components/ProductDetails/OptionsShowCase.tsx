import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/redux/hook";
import { useVariant } from "../../../variants/hooks/useVariant";

interface OptionsShowCaseProps {
  selectedVariant: any;
  setSelectedVariant: (variant: any) => void;
}

const OptionsShowCase = ({ selectedVariant, setSelectedVariant }: OptionsShowCaseProps) => {
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  if (!slugProduct) return null;

  const { GetVariantHandler } = useVariant();

  useEffect(() => {
    if (!slugProduct) return;
    GetVariantHandler(slugProduct._id);
  }, [slugProduct]);

  const options = slugProduct.options || [];
  const variants = useAppSelector((state) => state.variant.variants) || [];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Auto-select single values if only one value exists for an option
  useEffect(() => {
    if (options.length > 0) {
      const initialSelections: Record<string, string> = {};
      options.forEach((opt) => {
        if (opt.values && opt.values.length === 1) {
          initialSelections[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [slugProduct]);

  // Find matching variant when selectedOptions change
  useEffect(() => {
    if (options.length === 0) {
      setSelectedVariant(null);
      return;
    }

    const allSelected = options.every((opt) => selectedOptions[opt.name]);
    if (allSelected) {
      const matched = variants.find((v) => {
        return options.every((opt) => v.attributes[opt.name] === selectedOptions[opt.name]);
      });
      setSelectedVariant(matched || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedOptions, variants, options]);

  // Helper to check if a value is available under current selections
  const isOptionValueAvailable = (optionName: string, value: string) => {
    if (variants.length === 0) return true;

    // Check if there is any variant matching:
    // 1. Current selected values for OTHER options
    // 2. This specific value for the current option
    // 3. Stock > 0
    return variants.some((v) => {
      // Must match this option value
      if (v.attributes[optionName] !== value) return false;

      // Must have stock
      if (v.stock <= 0) return false;

      // Must match other selections (excluding this optionName to allow switching)
      for (const opt of options) {
        if (opt.name === optionName) continue;
        const currentSelection = selectedOptions[opt.name];
        if (currentSelection && v.attributes[opt.name] !== currentSelection) {
          return false;
        }
      }
      return true;
    });
  };

  const handleSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => {
      if (prev[optionName] === value) {
        // Toggle off
        const updated = { ...prev };
        delete updated[optionName];
        return updated;
      }
      return {
        ...prev,
        [optionName]: value,
      };
    });
  };

  return (
    <div className="space-y-6 mb-6">
      {options.map((option, idx) => (
        <div key={idx}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-text capitalize">
              {option.name}
            </h3>

            {selectedOptions[option.name] && (
              <span className="text-sm text-primary font-medium">
                : {selectedOptions[option.name]}
              </span>
            )}
          </div>

          {/* Values */}
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionValueAvailable(option.name, value);

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(option.name, value)}
                  className={`
                    min-w-[60px]
                    px-4
                    py-2.5
                    rounded-[14px]
                    border
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    active:scale-95
                    ${
                      isSelected
                        ? `
                          bg-primary
                          text-background-light
                          border-primary
                          shadow-md
                        `
                        : isAvailable
                        ? `
                          bg-background-light
                          text-text
                          border-border
                          hover:border-primary
                          hover:bg-background-subtle
                          cursor-pointer
                        `
                        : `
                          bg-background-light/40
                          text-text-subtle/40
                          border-border/30
                          opacity-40
                          cursor-not-allowed
                          relative
                          overflow-hidden
                        `
                    }
                  `}
                >
                  {value}
                  {!isAvailable && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-[120%] h-[1px] bg-text-subtle/30 rotate-12"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionsShowCase;
