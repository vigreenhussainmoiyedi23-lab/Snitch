import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/redux/hook";
import { useVariant } from "../../../variants/hooks/useVariant";

const OptionsShowCase = ({ selectedVariant, setSelectedVariant }) => {
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  if (!slugProduct) return null;
  const { GetVariantHandler } = useVariant();
  useEffect(() => {
    if (!slugProduct) return;
    GetVariantHandler(slugProduct._id);
  }, [slugProduct]);
  const options = slugProduct.options;
  const variants = useAppSelector((state) => state.variant.variants);
  const [availableOptions, setAvailableOptions] = useState(slugProduct.options);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!slugProduct) return;
    let options = [] as { name: string; values: string[] }[];
    if (variants) {
      variants.map((v) => {
        Object.entries(v.attributes).map(([key, value]) => {
          if (!key || !value) return;
          if (typeof value !== "string") return;
          let option = options.find((o) => o.name === key);
          if (option) {
            if (option.values.includes(value)) return;
            option.values.push(value);
          } else {
            options.push({ name: key, values: [value] });
          }
        });
      });
    }
    let newOptions = slugProduct.options.map((o) => {
      if (options.find((oo) => oo.name === o.name)) {
        let newValues = [...options.find((oo) => oo.name === o.name)!.values];
        return {
          ...o,
          values: newValues,
        };
      } else return null;
    });
    // handle selectedOptions for real variant combos
    newOptions = newOptions.filter(Boolean) as any;
    setAvailableOptions(newOptions as any);
  }, [slugProduct, variants]);
  const handleSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
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
              <span className="text-sm text-text-subtle">
                : {selectedOptions[option.name]}
              </span>
            )}
          </div>

          {/* Values */}
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const hasVariant = availableOptions
                .find((o) => o.name === option.name)
                ?.values.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(option.name, value)}
                  style={
                    hasVariant
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "red", cursor: "not-allowed" }
                  }
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
                        : `
                          bg-background-light
                          text-text
                          border-border
                          hover:border-primary
                          hover:bg-background-subtle
                        `
                    }
                  `}
                >
                  {value}
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
