import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash, X } from "lucide-react";
import type { ProductFormValues } from "./types";
type Props = {
  setOptionImages: React.Dispatch<React.SetStateAction<File[]>>;
  optionImages:File[]
};
const OptionsEditor = ({ setOptionImages,optionImages }: Props) => {
  const { register, control, setValue, getValues } =
    useFormContext<ProductFormValues>();

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  const [valueInputs, setValueInputs] = useState<Record<number, string>>({});
  const addValue = (optionIndex: number) => {
    const value = valueInputs[optionIndex]?.trim();

    if (!value) return;

    const currentValues = getValues(`options.${optionIndex}.values`) || [];

    // Prevent duplicate values
    if (
      currentValues.some(
        (existing) => existing.toLowerCase() === value.toLowerCase(),
      )
    ) {
      return;
    }

    setValue(`options.${optionIndex}.values`, [...currentValues, value], {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(`options.${optionIndex}.imageMap.${value}`, optionImages);

    setValueInputs((prev) => ({
      ...prev,
      [optionIndex]: "",
    }));

    setOptionImages([]);
  };

  const removeValue = (optionIndex: number, valueIndex: number) => {
    const currentValues = getValues(`options.${optionIndex}.values`) || [];

    setValue(
      `options.${optionIndex}.values`,
      currentValues.filter((_, index) => index !== valueIndex),
      {
        shouldDirty: true,
      },
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setOptionImages(files);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-primary">Product Options</h2>

        <p className="text-sm text-primary-lighter/60 mt-1">
          Add options such as size, color, material, or capacity.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {optionFields.map((option, optionIndex) => {
          const values = getValues(`options.${optionIndex}.values`) || [];

          return (
            <div
              key={option.id}
              className="rounded-xl border border-border bg-background p-5"
            >
              {/* Option header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-sm  uppercase tracking-wider text-text mate font-semibold">
                    Option {optionIndex + 1}
                  </span>

                  <p className="text-lg text-text/90 font-medium mt-0.5">
                    Define a selectable product attribute
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    removeOption(optionIndex);
                    setOptionImages([]);
                  }}
                  className="p-2 rounded-lg   bg-red-500 text-white hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Remove option"
                >
                  <Trash size={18} />
                </button>
              </div>

              {/* Option name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-text mb-2">
                  Option name
                </label>

                <input
                  {...register(`options.${optionIndex}.name`)}
                  placeholder="e.g. Size, Color, Material"
                  className="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              {/* Values */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Values
                </label>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 min-h-10 mb-3">
                  {values.length > 0 ? (
                    values.map((value, valueIndex) => (
                      <div
                        key={`${value}-${valueIndex}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-text"
                      >
                        <span>{value}</span>

                        <button
                          type="button"
                          onClick={() => removeValue(optionIndex, valueIndex)}
                          className="text-text/40 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text/40 py-1">
                      No values added yet
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex gap-2">
                    {optionImages.map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="w-20 h-20 bg-center bg-cover"
                      />
                    ))}
                  </div>
                  {/* Add value */}
                  <div className="flex gap-2">
                    <input
                      value={valueInputs[optionIndex] || ""}
                      onChange={(e) =>
                        setValueInputs((prev) => ({
                          ...prev,
                          [optionIndex]: e.target.value,
                        }))
                      }
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addValue(optionIndex);
                        }
                      }}
                      placeholder="Enter a value..."
                      className="flex-1 h-10 bg-background border border-border rounded-lg px-3 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <label
                      className="flex w-45 text-center items-center justify-around gap-2 px-4 h-10 rounded-lg bg-background border border-border text-sm font-medium text-text cursor-pointer hover:bg-primary/5 transition-colors"
                      htmlFor="ImageMap"
                    >
                      Upload Images For This Value
                    </label>
                    <input
                      onChange={(e) => handleImageUpload(e)}
                      type="file"
                      id="ImageMap"
                      multiple
                      max={5}
                      hidden
                    />
                    <button
                      type="button"
                      onClick={() => addValue(optionIndex)}
                      className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary-dark transition active:scale-[0.98]"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text/40 mt-2">
                  Press Enter to quickly add a value.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add option */}
      <button
        type="button"
        onClick={() =>
          appendOption({
            name: "",
            values: [],
          })
        }
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <Plus size={18} />
        Add another option
      </button>
    </div>
  );
};

export default OptionsEditor;
