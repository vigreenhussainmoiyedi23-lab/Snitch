import { useAppSelector } from "../../../../app/redux/hook";
import CreatableInput from "../../../admin/components/product/Form/CreatableSelect";

const ClassisficationSection = () => {
    const enums=useAppSelector((state:any)=>state.product.enums);
  return (
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
  );
};

export default ClassisficationSection;
