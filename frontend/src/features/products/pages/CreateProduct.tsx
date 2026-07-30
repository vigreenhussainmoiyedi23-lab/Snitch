import { useForm } from "react-hook-form";
import Input from "../components/Form/Input";
import TextArea from "../components/Form/TextArea";
const CreateProduct = () => {
  const { register, handleSubmit, reset } = useForm();
  const SubmitHandler = async (data: any) => {
    console.log(data);
    reset();
  };
  return (
    <div className=" w-full h-full flex items-center justify-center">
      <form
        className="bg-text w-full max-w-4xl px-10 py-5 overflow-y-auto max-h-200"
        onSubmit={handleSubmit(SubmitHandler)}
      >
        <h1 className="text-xl md:text-3xl ezcar tracking-wider font-bold text-white my-6 ">
          Create Product
        </h1>
        <Input
          placeholder="Enter Product Title"
          register={register}
          name="title"
          type="text"
        />
        <Input
          placeholder="Enter Product's short Description"
          register={register}
          name="shortDescription"
          type="text"
        />
        <TextArea
          placeholder="Enter Product Description"
          register={register}
          name="description"
          isRequired={true}
          minLength={20}
        />
        <div className="flex md:flex-row flex-col items-center md:gap-5">
          <Input
            placeholder="Enter Product Price"
            register={register}
            name="price"
            type="number"
          />
          <Input
            placeholder="Enter Product Discount"
            register={register}
            name="discount"
            type="number"
          />
        </div>
        {/* Stock brand category subCategory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5  ">
          <Input
            placeholder="Enter Product Stock"
            register={register}
            name="stock"
            type="number"
          />
          <Input
            placeholder="Enter Product Brand"
            register={register}
            name="brand"
            type="text"
          />
          <Input
            placeholder="Enter Product Category"
            register={register}
            name="category"
            type="text"
          />
          <Input
            placeholder="Enter Product Sub Category"
            register={register}
            name="subCategory"
            type="text"
          />
        </div>
        <div>
          <div className="flex  gap-3 items-center justify-center">
            <label className="text-background mate" htmlFor="isFeatured">
              Product is Featured :{" "}
            </label>
            <input {...register("isFeatured")} type="checkbox" />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary teko text-white px-10 py-2 rounded-full mt-5 w-full"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
