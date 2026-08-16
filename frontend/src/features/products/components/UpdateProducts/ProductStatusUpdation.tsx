import Select from "../Select";

const ProductStatusUpdation = ({ methods }: { methods: any }) => {
  return (
    <div className="px-3">
      <h3 className="-mx-3 text-2xl text-primary teko tracking-wider">
        Product Status Updation
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          Name="status"
          array={["published", "draft", "archived"]}
          label="Status"
          register={methods.register}
        />
        <Select
          Name="visibility"
          array={["public", "private"]}
          label="Visibility"
          register={methods.register}
        />
        <Select
          Name="isFeatured"
          array={["true", "false"]}
          label="Featured"
          register={methods.register}
        />
      </div>
    </div>
  );
};

export default ProductStatusUpdation;
