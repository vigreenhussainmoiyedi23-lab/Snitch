import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ImagesSection from "../components/UpdateProducts/ImagesSection";
import ClassisficationSection from "../components/UpdateProducts/ClassisficationSection";
import PriceSection from "../components/UpdateProducts/PriceSection";
import ProductStatusUpdation from "../components/UpdateProducts/ProductStatusUpdation";
import MainDetails from "../components/UpdateProducts/MainDetails";
export type Image = {
  url: string;
  thumbnailUrl: string;
  fileId: string;
};

import OptionsEditor from "../../admin/components/CreateProduct/OptionsEditor";
import AttributeEditor from "../../admin/components/CreateProduct/AttributeEditor";
import type { optionImages } from "../../admin/components/CreateProduct/types";

const UpdateProducts = () => {
  const { slug } = useParams();
  if (!slug) return null;
  const loading = useAppSelector((state: any) => state.product.loading);
  const slugProduct = useAppSelector((state: any) => state.product.slugProduct);
  const [optionImages, setOptionImages] = useState([] as optionImages);
  const methodsForOptions = useForm({
    defaultValues: {
      options: [] as File[] | Image[],
      remove: [] as { name: string; fileId: string; value: string }[],
    },
  });
  const { UpdateProductsPutHandler, GetProductThroughSlug } = useProduct();

  useEffect(() => {
    GetProductThroughSlug(slug);
  }, [slug]);
  useEffect(() => {
    if (!slugProduct?.options) return;
    const optionImagesInside = slugProduct.options.map(
      (option: { name: string; values: string[]; imageMap: any }) => {
        return option.values.map((value) => ({
          valueName: value,
          images: option.imageMap[value],
          optionName: option.name,
        }));
      },
    );
    setOptionImages(optionImagesInside.flat());
    methodsForOptions.reset({
      options: slugProduct.options,
      remove: [] as { name: string; fileId: string; value: string }[],
    });
  }, [slugProduct?.options, methodsForOptions]);
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
      // UI representation
      attributes: [] as { key: string; value: string }[],
    },
  });

  const [keep, setKeep] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (slugProduct) {
      const attributes = slugProduct.attributes
        ? Object.entries(slugProduct.attributes).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];

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
        attributes: attributes || {},
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

    const attributes = data?.attributes?.reduce((acc: any, val: any) => {
      acc[val.key] = val.value;
      return acc;
    }, {});
    const formattedData = {
      ...data,
      tags: data.tags,
      status: data.status,
      isFeatured: data.isFeatured === "true" || data.isFeatured === true,
      mrp: Number(data.mrp),
      stock: Number(data.stock),
      discount: Number(data.discount),
      attributes: attributes || {},
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
  const onOptionsSubmit = async (data: any) => {
    console.log(data,slugProduct.options);

    const formData = new FormData();
    optionImages.forEach((image) => {
      if (image.images.length <= 0) return;
      image.images.forEach((img) => {
        if (img instanceof File)
          formData.append(`${image.optionName}:${image.valueName}`, img);
      });
    });

    try {
      await UpdateProductsPutHandler({
        id: slugProduct._id,
        data: data,
      });
      toast.success("Product options updated successfully!");
      GetProductThroughSlug(slug);
    } catch (err) {
      toast.error("Failed to update options");
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
            <MainDetails methods={methods} />
            <div className="flex flex-col gap-8">
              {/* Category | SubCategory | Brand | Tags | Barcode */}
              <ClassisficationSection methods={methods} />
              {/* Status | Visibility | isFeatured */}
              <ProductStatusUpdation methods={methods} />
              {/* mrp | discount | stock */}
              <PriceSection methods={methods} />
              <AttributeEditor />
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

      {/* Options Section */}
      <section className="bg-text p-6 rounded-xl shadow-soft mt-6">
        <FormProvider {...methodsForOptions}>
          <form onSubmit={methodsForOptions.handleSubmit(onOptionsSubmit)}>
            <OptionsEditor
              optionImages={optionImages}
              setOptionImages={setOptionImages}
            />
            <button
              type="submit"
              className="bg-primary font-bold mt-12 text-white px-4 py-2 rounded-full"
            >
              Save Options
            </button>
          </form>
        </FormProvider>
      </section>
    </div>
  );
};

export default UpdateProducts;
