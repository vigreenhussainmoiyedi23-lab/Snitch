import { useForm } from "react-hook-form";
import Input from "../components/Form/Input";
import TextArea from "../components/Form/TextArea";
import { useState } from "react";
import { X } from "lucide-react";
const CreateProduct = () => {
  const [images, setImages] = useState<File[]>([]);
  const { register, handleSubmit, reset } = useForm();
  const SubmitHandler = async (data: any) => {
    console.log(data, images);
    reset();
  };
  return (
    <div className=" w-full h-full flex items-center justify-center">
      <form
        className="w-full h-screen flex gap-4  justify-between  px-10 py-5 overflow-y-auto max-h-200"
        onSubmit={handleSubmit(SubmitHandler)}
      >
        <div className="w-2/3 bg-text px-5 py-3">
          <h1 className="text-xl md:text-3xl ezcar tracking-wider font-bold text-primary-light my-6 ">
            Create Product
          </h1>
          <div className="bg-text p-4 rounded-xl mt-5">
            <h2 className="text-background   text-sm font-serif  mb-4 ">Product Images</h2>
            <div className=" py-2 flex gap-5">
              {images &&
                images.map((image, idx) => (
                  <div className="relative ">
                    <X
                      onClick={() => {
                        setImages((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white cursor-pointer rounded-full"
                    />
                    <img
                      key={image.name}
                      src={URL.createObjectURL(image)}
                      alt={image.name}
                      className="w-20 h-20 bg-center bg-cover"
                    />
                  </div>
                ))}
            </div>
            <label
              htmlFor="images"
              className="border-2 border-dashed border-border rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-primary transition"
            >
              <span className="text-background">Click or Drag Images Here</span>
            </label>

            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (!e.target.files) return;

                const files = Array.from(e.target.files);

                setImages((prev) => [...prev, ...files]);

                // Allows selecting same file again
                e.target.value = "";
              }}
            />
          </div>
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
        </div>
        <div className="w-1/3 bg-text p-4 ">
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

          {/* Stock brand category subCategory */}
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
          <div className="flex  gap-3 items-center justify-center">
            <label className="text-background mate" htmlFor="isFeatured">
              Product is Featured :{" "}
            </label>
            <input {...register("isFeatured")} type="checkbox" />
          </div>
          <button
            type="submit"
            className="bg-primary items-center justify-center tracking-[0.2rem] text-xl flex text-center teko text-white px-10 py-2 rounded-full mt-5 w-full"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
