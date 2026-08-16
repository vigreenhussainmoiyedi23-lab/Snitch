import Input from "../../../admin/components/product/Form/Input";
import TextArea from "../../../admin/components/product/Form/TextArea";

const MainDetails = ({ methods }: { methods: any }) => {
  return (
    <div>
      <Input
        name="title"
        type="text"
        register={methods.register}
        placeholder="Product Title"
        minLength={10}
      />
      <TextArea
        name="shortDescription"
        register={methods.register}
        height={16}
        placeholder="Short Description"
      />
      <TextArea
        name="description"
        register={methods.register}
        placeholder="Full Description"
      />
    </div>
  );
};

export default MainDetails;
