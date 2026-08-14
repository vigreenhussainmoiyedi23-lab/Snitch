import React from "react";
import { X } from "lucide-react";

interface AttributeInputRowProps {
  keyValue: string;
  value: string;
  onKeyChange: (key: string) => void;
  onValueChange: (value: string) => void;
  onRemove: () => void;
  showRemove: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}

const AttributeInputRow: React.FC<AttributeInputRowProps> = ({
  keyValue,
  value,
  onKeyChange,
  onValueChange,
  onRemove,
  showRemove,
  keyPlaceholder = "Key (e.g. color)",
  valuePlaceholder = "Value (e.g. blue)",
}) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={keyValue}
        onChange={(e) => onKeyChange(e.target.value)}
        placeholder={keyPlaceholder}
        className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={valuePlaceholder}
        className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
      />
      {showRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-danger hover:text-danger-dark rounded hover:bg-danger/10 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AttributeInputRow;
