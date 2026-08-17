import React, { useEffect, useRef, useState } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { ImagePlus, Plus, Trash, X } from "lucide-react";
import type { optionImages, ProductFormValues } from "./types";
type Props = {
  setOptionImages: React.Dispatch<React.SetStateAction<optionImages>>;
  optionImages: optionImages;
};
const OptionsEditor = ({ setOptionImages, optionImages }: Props) => {
  const { register, control, setValue, getValues } =
    useFormContext<ProductFormValues>();
  const [selectedImages, setSelectedImages] = useState([] as File[]);
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });
  const options = useWatch({ control, name: "options" });
  useEffect(() => {
    const timer = setTimeout(() => {
      setOptionImages((prev) => {
        return prev.map((image) => {
          const optionIndex = options?.findIndex(
            (option) => option.name === image.optionName,
          );

          if (optionIndex === -1) {
            return image;
          }

          return {
            ...image,
            optionName: options[optionIndex].name,
          };
        });
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [options, setOptionImages]);
  const imageUplodref = useRef<HTMLInputElement>(null);
  const previousNamesRef = useRef<Record<number, string>>({});
  const [valueInputs, setValueInputs] = useState<Record<number, string>>({});

  const addValue = (optionIndex: number) => {
    const value = valueInputs[optionIndex]?.trim();
    if (!value) return;
    if (
      imageUplodref.current &&
      imageUplodref.current.files &&
      imageUplodref.current.files.length > 0
    ) {
      const files = Array.from(imageUplodref.current.files);
      setOptionImages((prev) => {
        return [
          ...prev,
          {
            valueName: value,
            images: files,
            optionName: getValues(`options.${optionIndex}.name`),
          },
        ];
      });
      imageUplodref.current.value = "";
    }

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

    setValueInputs((prev) => ({
      ...prev,
      [optionIndex]: "",
    }));
    setSelectedImages([]);
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
    setValueInputs((prev) => ({
      ...prev,
      [optionIndex]: "",
    }));
    if (
      optionImages.find((item) => item.valueName === currentValues[valueIndex])
    ) {
      setOptionImages((prev: optionImages) => {
        const newPrev = prev.filter(
          (item) => item.valueName !== currentValues[valueIndex],
        );
        return newPrev;
      });
    }
    setSelectedImages([]);
  };
  const changeOptionName = (e: any, optionIndex: number) => {
    const newName = e.target.value;
    const oldName = previousNamesRef.current[optionIndex];

    setOptionImages((prev: optionImages) => {
      return prev.map((image) => {
        if (image.optionName === oldName) {
          return {
            ...image,
            optionName: newName,
          };
        } else return image;
      });
    });
    previousNamesRef.current[optionIndex] = newName;
  };
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }
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
                  {...register(`options.${optionIndex}.name`, {
                    onChange: (e) => {
                      changeOptionName(e, optionIndex);
                    },
                  })}
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
                    values.map((value: any, valueIndex) => {
                      if (!value) return null;
                      const optionImage = optionImages.find(
                        (i) =>
                          i.valueName === value &&
                          i.optionName ===
                            getValues(`options.${optionIndex}.name`),
                      );
                      let image, src;
                      if (
                        optionImage &&
                        optionImage.images &&
                        optionImage.images.length > 0
                      ) {
                        console.log(optionImage);

                        image = optionImage?.images[0];
                        src =
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : image.url;
                      }

                      return (
                        <div
                          key={`${value}-${valueIndex}`}
                          className="inline-flex items-center flex-col gap-1.5 rounded border border-border bg-background px-3 py-1.5 text-sm text-text"
                        >
                          {optionImage &&
                            optionImage.images &&
                            optionImage.images.length > 0 && (
                              <img
                                src={src}
                                alt={optionImage.valueName}
                                className="w-8 h-8 rounded object-center object-cover"
                              />
                            )}
                          <div className="flex gap-2">
                            <span>{value}</span>
                            <button
                              type="button"
                              onClick={() =>
                                removeValue(optionIndex, valueIndex)
                              }
                              className="text-text/40 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-text/40 py-1">
                      No values added yet
                    </p>
                  )}
                </div>
                <div>
                  {selectedImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Selected Images
                      </label>
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative w-fit">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Selected"
                            className="w-20 h-20 rounded object-center object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className=" text-white rounded-full p-1 absolute top-2 right-2 bg-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                      htmlFor="ImageMap"
                      className="
    group flex h-10 w-52 cursor-pointer items-center justify-center gap-2
    rounded-lg border border-dashed border-border
    bg-background px-4
    text-sm font-medium text-text/70
    transition-all duration-200
    hover:border-primary/60
    hover:bg-primary/5
    hover:text-primary
    active:scale-[0.98]
  "
                    >
                      <ImagePlus
                        size={17}
                        strokeWidth={1.8}
                        className="transition-transform duration-200 group-hover:-translate-y-0.5"
                      />

                      <span>Upload images</span>
                    </label>
                    <input
                      ref={imageUplodref}
                      type="file"
                      id="ImageMap"
                      multiple
                      max={5}
                      hidden
                      onChange={(e) => {
                        if (!e.target.files) return;
                        setSelectedImages(Array.from(e.target.files));
                      }}
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
