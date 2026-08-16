import { useAppSelector } from "../../../../app/redux/hook";
import CreatableInput from "../../../admin/components/product/Form/CreatableSelect";
import Input from "../../../admin/components/product/Form/Input";

const ClassisficationSection = ({ methods }: { methods: any }) => {
  const enums = useAppSelector((state: any) => state.product.enums);
  return (
    <div className="px-3">
      <h3 className="-mx-3 text-2xl text-primary teko tracking-wider">Classification Section</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="barcode"
          type="text"
          register={methods.register}
          placeholder="Barcode"
          isRequired={false}
        />
        <Input
          name="tags"
          type="text"
          register={methods.register}
          placeholder="Tags (comma separated)"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CreatableInput
          name="category"
          options={enums?.categories || []}
          placeholder="Category"
        />
        <CreatableInput
          name="subCategory"
          options={enums?.subCategories || []}
          placeholder="Sub Category"
        />
        <CreatableInput
          name="brand"
          options={enums?.brands || []}
          placeholder="Brand"
        />
      </div>
    </div>
  );
};

export default ClassisficationSection;
