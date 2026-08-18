import React from "react";
import { Check } from "lucide-react";

export type ProductOption = {
  name: string;
  values: string[];
  imageMap?: Record<string, any>;
};

interface OptionSelectorProps {
  options: ProductOption[];
  attributes: { key: string; value: string }[];
  onChange: (attrs: { key: string; value: string }[]) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  attributes,
  onChange,
}) => {
  if (!options || options.length === 0) return null;

  const getSelected = (optionName: string): string => {
    const row = attributes.find(
      (a) => a.key.toLowerCase() === optionName.toLowerCase()
    );
    return row?.value ?? "";
  };

  const handleSelect = (optionName: string, value: string) => {
    const alreadySelected = getSelected(optionName) === value;

    const updated = attributes.map((a) => {
      if (a.key.toLowerCase() === optionName.toLowerCase()) {
        return { ...a, value: alreadySelected ? "" : value };
      }
      return a;
    });

    const exists = attributes.some(
      (a) => a.key.toLowerCase() === optionName.toLowerCase()
    );
    if (!exists) {
      updated.push({ key: optionName, value });
    }

    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="mate text-xs text-text-subtle">Attributes</label>

      {options.map((option) => {
        const selected = getSelected(option.name);

        return (
          <div
            key={option.name}
            className="flex flex-col gap-2 p-3 rounded-lg border border-border/40 bg-background-light/20"
          >
            <div className="flex items-center justify-between">
              <span className="teko text-base tracking-wider text-text capitalize">
                {option.name}
              </span>
              {selected ? (
                <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full">
                  {selected}
                </span>
              ) : (
                <span className="text-xs text-text-subtle/50 italic">
                  — none selected
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {option.values.map((val) => {
                const mapEntry = option.imageMap?.[val];
                const imgSrc = Array.isArray(mapEntry)
                  ? mapEntry[0]?.thumbnailUrl || mapEntry[0]?.url
                  : (mapEntry as any)?.thumbnailUrl || (mapEntry as any)?.url;

                const isSelected = selected === val;

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelect(option.name, val)}
                    className={`group relative flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-150 active:scale-95 ${
                      isSelected
                        ? "border-primary bg-primary/15 text-primary shadow-sm"
                        : "border-border/50 bg-background text-text-subtle hover:border-primary/40 hover:bg-primary/5 hover:text-text"
                    }`}
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt={val}
                        className="w-8 h-8 rounded-lg object-cover object-center"
                      />
                    )}

                    <span>{val}</span>

                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OptionSelector;
