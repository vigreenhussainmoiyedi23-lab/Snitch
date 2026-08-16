import Input from "../../../admin/components/product/Form/Input";
const PriceSection = ({ methods }: { methods: any }) => {
  return (
    <div className="md:px-3">
      <h3 className="md:-mx-3 text-2xl text-primary teko tracking-wider">
        Price Section
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="mrp"
          type="number"
          register={methods.register}
          placeholder="MRP"
          min={0}
        />
        <Input
          name="discount"
          type="number"
          register={methods.register}
          placeholder="Discount %"
          min={0}
          max={100}
        />
        <Input
          name="stock"
          type="number"
          register={methods.register}
          placeholder="Stock"
          min={0}
        />
      </div>
    </div>
  );
};

export default PriceSection;
