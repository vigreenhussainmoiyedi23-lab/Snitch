import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../admin/components/product/Form/Input";
import TextArea from "../../admin/components/product/Form/TextArea";
import CreatableInput from "../../admin/components/product/Form/CreatableSelect";
import { Check, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import ImagesSection from "../components/UpdateProducts/ImagesSection";

const UpdateProducts = () => {
  const { slug } = useParams();
  if (!slug) return null;

  const enums = useAppSelector((state: any) => state.product.enums);
  const loading = useAppSelector((state: any) => state.product.loading);
  const slugProduct = useAppSelector((state: any) => state.product.slugProduct);

  const {
    UpdateProductsPatchHandler,
    UpdateProductsPutHandler,
    GetProductThroughSlug,
  } = useProduct();

  useEffect(() => {
    GetProductThroughSlug(slug);
  }, [slug]);

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      category: "",
      subCategory: "",
      brand: "",
      mrp: 0,
      stock: 0,
      barcode: "",
      tags: "",
      status: "",
      visibility: "",
      isFeatured: "false",
      discount: 0,
    },
  });

  const [keep, setKeep] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (slugProduct) {
      methods.reset({
        title: slugProduct.title || "",
        description: slugProduct.description || "",
        shortDescription: slugProduct.shortDescription || "",
        category: slugProduct.category || "",
        subCategory: slugProduct.subCategory || "",
        brand: slugProduct.brand || "",
        mrp: slugProduct.mrp || 0,
        stock: slugProduct.stock || 0,
        barcode: slugProduct.barcode || "",
        tags: slugProduct.tags?.join(", ") || "",
        status: slugProduct.status || "",
        visibility: slugProduct.visibility || "",
        isFeatured: slugProduct.isFeatured ? "true" : "false",
        discount: slugProduct.discount || 0,
      });

      if (slugProduct.images) {
        setKeep(slugProduct.images.map((img: any) => img.fileId));
      }
    }
  }, [slugProduct, methods]);

  if (loading) return <Loading subheading="Loading Product Details..." />;
  if (!slugProduct) return <Loading subheading="Product Not Found..." />;




  const onDetailsSubmit = async (data: any) => {
    // Format tags if needed
    const formattedData = {
      ...data,
      tags: data.tags,
      status: data.status,
      isFeatured: data.isFeatured === "true" || data.isFeatured === true,
      mrp: Number(data.mrp),
      stock: Number(data.stock),
      discount: Number(data.discount),
    };
    if (formattedData.barcode === "") delete formattedData.barcode;
    try {
      await UpdateProductsPutHandler({
        id: slugProduct._id,
        data: formattedData,
      });
      toast.success("Product details updated successfully!");
      GetProductThroughSlug(slug);
    } catch (err) {
      toast.error("Failed to update details");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-20 mate">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-dark mb-6 eczar">
          Update Product: {slugProduct.title}
        </h1>
        <div className="px-4 py-3 flex items-center gap-4">
          <Link
            to="/products"
            className="text-sm font-semibold bg-text px-3 py-1 rounded-full text-background"
          >
            View All Products
          </Link>
          <Link
            to="/admin"
            className="text-sm font-semibold bg-text px-3 py-1 rounded-full text-background"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      <ImagesSection
        keep={keep}
        setKeep={setKeep}
        newImages={newImages}
        setNewImages={setNewImages}
        newImagePreviews={newImagePreviews}
        setNewImagePreviews={setNewImagePreviews}
        slugProduct={slugProduct}
      />

      {/* Details Section */}
      <section className="bg-text p-6 rounded-xl shadow-soft">
        <h2 className="text-xl font-bold text-white eczar mb-6">
          Update Details
        </h2>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onDetailsSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="title"
                type="text"
                register={methods.register}
                placeholder="Product Title"
                minLength={10}
              />
              <Input
                name="barcode"
                type="text"
                register={methods.register}
                placeholder="Barcode"
                isRequired={false}
              />
            </div>

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

            <Input
              name="tags"
              type="text"
              register={methods.register}
              placeholder="Tags (comma separated)"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CreatableInput
                name="status"
                options={["published", "draft", "archived"]}
                placeholder="Status"
              />
              <CreatableInput
                name="visibility"
                options={["public", "private"]}
                placeholder="Visibility"
              />
              <CreatableInput
                name="isFeatured"
                options={["true", "false"]}
                placeholder="Is Featured?"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-medium transition-colors w-full md:w-auto"
              >
                Save Details
              </button>
            </div>
          </form>
        </FormProvider>
      </section>
    </div>
  );
};

export default UpdateProducts;
