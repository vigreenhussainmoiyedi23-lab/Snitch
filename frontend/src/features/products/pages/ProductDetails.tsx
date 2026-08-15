import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";
import { useVariant } from "../../variants/hooks/useVariant";
import CreateVariantSection from "../../variants/components/CreateVariantSection";
import ProductBreadcrumbs from "../components/ProductDetails/ProductBreadcrumbs";
import AdminActions from "../components/ProductDetails/AdminActions";
import ImageGallery from "../components/ProductDetails/ImageGallery";
import ProductInfo from "../components/ProductDetails/ProductInfo";

import ProductFeatures from "../components/ProductDetails/ProductFeatures";
import ProductSpecs from "../components/ProductDetails/ProductSpecs";
import ProductDescription from "../components/ProductDetails/ProductDescription";
import ReviewsSection from "../components/ProductDetails/ReviewsSection";
import OptionsShowCase from "../components/ProductDetails/OptionsShowCase";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { GetProductThroughSlug, DeleteProductHandler } = useProduct();
  const { GetVariantHandler } = useVariant();
  const [images, setImages] = useState([] as { fileId: string; url: string }[]);

  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  const loading = useAppSelector((state) => state.product.loading);
  const user = useAppSelector((state) => state.auth.user);
  const variants = useAppSelector((state) => state.variant.variants);
 

  useEffect(() => {
    if (slug) {
      GetProductThroughSlug(slug);
    }
  }, [slug]);
  useEffect(() => {
    if (slugProduct && slugProduct.images.length > 0) {
      setImages(slugProduct.images);
    }
  }, [slugProduct]);


  useEffect(() => {
    if (slugProduct?._id) {
      GetVariantHandler(slugProduct._id);
    }
  }, [slugProduct?._id]);

  if (loading) return <Loading subheading="Loading Product Details" />;

  if (!slugProduct)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="eczar text-3xl text-text mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate("/products")}
            className="teko text-xl bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );

  const {
    title,
    description,
    shortDescription,
    mrp,
    finalPrice,
    discount,
    stock,
    brand,
    category,
    rating,
    tags,
    attributes,
  } = slugProduct;
  if (!images) {
    return <Loading subheading="Loading Product Images" />;
  }
  return (
    <div className="min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8">
      <ProductBreadcrumbs category={category} />

      <div className="max-w-7xl mx-auto">
        {user && user.role === "admin" && (
          <AdminActions
            slug={slug!}
            onDelete={() => {
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this product?",
              );
              if (!confirmDelete) return;
              DeleteProductHandler(slugProduct._id);
            }}
          />
        )}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <ImageGallery images={images} title={title} tags={tags} />

          <div className="w-full lg:w-1/2 flex flex-col">
            <ProductInfo
              title={title}
              brand={brand}
              description={description}
              shortDescription={shortDescription}
              mrp={mrp}
              finalPrice={finalPrice}
              discount={discount}
              stock={stock}
              rating={rating}
              product={slugProduct}
            />
            <OptionsShowCase/>
            <CreateVariantSection
              productId={slugProduct._id}
              isAdmin={user?.role === "admin"}
              onRefresh={() => {
                if (slug) GetProductThroughSlug(slug);
                if (slugProduct?._id) GetVariantHandler(slugProduct._id);
              }}
            />

            <ProductFeatures />
          </div>
        </div>

        <div
          className="mt-16 max-w-4xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <ProductSpecs
            brand={brand}
            category={category}
            attributes={attributes}
          />
          <ProductDescription description={description} />
        </div>
      </div>

      <ReviewsSection />
    </div>
  );
};

export default ProductDetails;
