import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ProductFormValues } from "./types";

/**
 * Dynamic key/value attribute editor.
 * Inputs stay cream (bg-background) for contrast against the dark card.
 * Labels and Add button adapted for dark bg context.
 */
const AttributeEditor = () => {
  const { control, register } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  // Cream input on dark card — highest contrast, matches other form inputs
  const inputCls =
    "w-full h-10 bg-background border border-border text-text text-sm rounded-lg px-3 " +
    "outline-none mate transition-all duration-200 " +
    "hover:border-primary-lighter " +
    "focus:border-primary focus:shadow-[0_0_0_3px_rgba(247,136,13,0.12)] " +
    "placeholder:text-background-subtle";

  return (
    <div className="space-y-2">
      {/* Column headers */}
      {fields.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_36px] gap-2 px-1 mb-1">
          <span className="mate text-[10px] uppercase tracking-widest text-background-subtle font-semibold">
            Key
          </span>
          <span className="mate text-[10px] uppercase tracking-widest text-background-subtle font-semibold">
            Value
          </span>
          <span />
        </div>
      )}

      {/* Attribute rows */}
      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center animate-fade-in"
        >
          <input
            {...register(`attributes.${idx}.key`)}
            placeholder="e.g. Color"
            className={inputCls}
          />
          <input
            {...register(`attributes.${idx}.value`)}
            placeholder="e.g. Black"
            className={inputCls}
          />
          <button
            type="button"
            aria-label="Remove attribute"
            onClick={() => remove(idx)}
            className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-danger bg-danger/10 hover:bg-danger hover:text-white transition-colors duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Add button — outlined style visible on dark bg */}
      <button
        type="button"
        onClick={() => append({ key: "", value: "" })}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border text-background-subtle rounded-lg hover:border-primary hover:text-primary transition-colors duration-150 mt-1"
      >
        <Plus className="w-4 h-4" />
        <span className="teko text-sm tracking-wider">Add Attribute</span>
      </button>
    </div>
  );
};

export default AttributeEditor;
