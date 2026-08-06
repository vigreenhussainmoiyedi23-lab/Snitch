import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../admin/components/product/Form/Input";
import TextArea from "../../admin/components/product/Form/TextArea";
import CreatableInput from "../../admin/components/product/Form/CreatableSelect";
import { Check, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

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

  const handleToggleKeep = (fileId: string) => {
    if (keep.includes(fileId)) {
      setKeep(keep.filter((id) => id !== fileId));
    } else {
      if (keep.length + newImages.length >= 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setKeep([...keep, fileId]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const availableSlots = 5 - (keep.length + newImages.length);
      const filesToAdd = files.slice(0, availableSlots);
      if (files.length > availableSlots) {
        toast.error(`Only ${availableSlots} more images can be added.`);
      }

      setNewImages([...newImages, ...filesToAdd]);

      const previews = filesToAdd.map((f) => URL.createObjectURL(f));
      setNewImagePreviews([...newImagePreviews, ...previews]);
    }
  };

  const removeNewImage = (index: number) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...newImagePreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setNewImagePreviews(updatedPreviews);
  };

  const onImagesSubmit = async () => {
    if (keep.length + newImages.length === 0) {
      toast.error("Please keep or upload at least 1 image");
      return;
    }

    const formData = new FormData();
    keep.forEach((id) => formData.append("keep", id));
    newImages.forEach((file) => formData.append("images", file));

    try {
      await UpdateProductsPatchHandler({ id: slugProduct._id, data: formData });
      setNewImages([]);
      toast.success("Images updated successfully!");
      GetProductThroughSlug(slug);
    } catch (err) {
      toast.error("Failed to update images");
    }
  };

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
      </div>

      {/* Images Section */}
      <section className="bg-text p-6 rounded-xl shadow-soft mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white eczar">Manage Images</h2>
          <span className="text-sm font-semibold bg-gold-dark px-3 py-1 rounded-full text-background">
            {keep.length + newImages.length} / 5 Images Selected
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-background-light mb-3">
            Previous Images
          </h3>
          <div className="flex flex-wrap gap-4">
            {slugProduct.images?.map((img: any) => {
              const isKept = keep.includes(img.fileId);
              return (
                <div
                  key={img.fileId}
                  className={`relative w-28 h-36 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${isKept ? "border-success shadow-md scale-100" : "border-background-subtle opacity-60 scale-95 grayscale"}`}
                  onClick={() => handleToggleKeep(img.fileId)}
                >
                  <img
                    src={img.url}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  {isKept ? (
                    <div className="absolute top-1 right-1 bg-success text-white rounded-full p-1">
                      <Check size={14} className="lucide lucide-check" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-black/60 rounded">
                        Discarded
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-background-light mb-3">
            New Images
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            {newImagePreviews.map((preview, idx) => (
              <div
                key={idx}
                className="relative w-28 h-36 rounded-lg overflow-hidden border-2 border-primary-light shadow-md"
              >
                <img
                  src={preview}
                  alt="New upload"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 hover:bg-danger-dark transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {keep.length + newImages.length < 5 && (
              <label className="w-28 h-36 rounded-lg border-2 border-dashed border-primary flex flex-col items-center justify-center cursor-pointer hover:bg-background-subtle transition-colors text-primary-dark">
                <Upload size={24} className="mb-2" />
                <span className="text-xs font-bold text-center px-2">
                  Upload Image
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={onImagesSubmit}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors"
        >
          Save Images
        </button>
      </section>

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
