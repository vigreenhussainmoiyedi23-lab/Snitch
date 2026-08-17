import { useState } from "react";
import { useAppSelector } from "../../../../app/redux/hook";


const OptionsShowCase = () => {
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  if (!slugProduct) return null;
  const options = slugProduct.options;
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const handleSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return (
    <div className="space-y-6 mb-6">
      {options.map((option,idx) => (
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
