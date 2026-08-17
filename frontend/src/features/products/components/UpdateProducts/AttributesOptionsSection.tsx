import { useEffect, useState } from "react";
import AttributeEditor from "../../../admin/components/CreateProduct/AttributeEditor";
import OptionsEditor from "../../../admin/components/CreateProduct/OptionsEditor";
import type { optionImages } from "../../../admin/components/CreateProduct/types";
export type Image = {
  url: string;
  thumbnailUrl: string;
  fileId: string;
};

type ImageMap = {
  [key: string]: Image[];
};
type Props = {
  options: {
    name: string;
    values: string[];
    imageMap: ImageMap;
  }[];
};

const AttributesOptionsSection = ({ options }: Props) => {
  const [optionImages, setOptionImages] = useState([] as optionImages);
  useEffect(() => {
    if (!options) return;
    const optionImagesInside = options.map((option) => {
      return option.values.map((value) => ({
        valueName: value,
        images: option.imageMap[value],
        optionName: option.name,
      }));
    });
    setOptionImages(optionImagesInside.flat());
  }, [options]);

  return (
    <section className="bg-text p-6 rounded-xl shadow-soft space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white eczar">
          Attributes & Options
        </h2>

        <p className="text-sm text-background-subtle mt-1">
          Manage product attributes and selectable options.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Product Attributes
        </h3>

        <AttributeEditor />
      </div>

      <div className="border-t border-border pt-8">
        <OptionsEditor
          optionImages={optionImages}
          setOptionImages={setOptionImages}
        />
        <p className="text-sm text-background-subtle">
          Note: you can only delete old values
        </p>
      </div>
    </section>
  );
};

export default AttributesOptionsSection;
