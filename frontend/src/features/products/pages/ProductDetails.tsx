import { useParams, useNavigate, Link } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/redux/hook";
import Loading from "../../../commonComponents/Loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Star,
  Minus,
  Plus,
  CreditCard,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
} from "lucide-react";
import AddToCartButton from "../../cart/components/AddToCartButton";
import type { CartItem } from "../../cart/@types/cart.types";
import CartAction from "../../cart/components/CartAction";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { GetProductThroughSlug, DeleteProductHandler } = useProduct();
  const slugProduct = useAppSelector((state) => state.product.slugProduct);
  const loading = useAppSelector((state) => state.product.loading);
  const user = useAppSelector((state) => state.auth.user);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (slug) {
      GetProductThroughSlug(slug);
    }
  }, [slug]);

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

  // Destructure for easy access
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
    images,
    rating,
    tags,
    attributes,
  } = slugProduct;



  const getRatingValue = () => {
    if (typeof rating === "number") return rating;
    if (rating && typeof rating === "object" && "average" in rating)
      return rating?.average;
    return 0;
  };
  const ratingValue = getRatingValue();

  return (
    <div className="min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-8 animate-fade-in">
        <nav className="flex items-center text-sm font-medium mate text-text-subtle">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <button
            onClick={() => navigate("/products")}
            className="hover:text-primary transition-colors"
          >
            Shop
          </button>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-text-mutes capitalize">
            {category || "Product"}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto">
        {user && user.role === "admin" && (
          <div className="flex items-center gap-4  justify-end">
            <Link
              to={`/product/${slug}/update`}
              className="bg-gold-dark shadow-md active:scale-90 hover:opacity-95 text-xl teko text-center tracking-wider text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-all"
            >
              Update Product
            </Link>
            <button
              onClick={() => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this product?",
                );
                if (!confirmDelete) return;
                DeleteProductHandler(slugProduct._id);
              }}
              className="bg-red-500 shadow-md active:scale-90 hover:opacity-95 text-xl teko text-center tracking-wider text-white py-2 px-4 rounded-md hover:bg-red-600 transition-all"
            >
              Delete Product
            </button>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-full lg:sticky lg:top-24 animate-slide-in">
            {/* Thumbnails */}
            <div className="flex w-fit md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
              {images?.map((img: any, idx: number) => (
                <button
                  key={img._id || idx}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative shrink-0 w-20 h-24 rounded-radius-md overflow-hidden border-2 transition-all duration-300 ${activeImage === img.url ? "border-primary shadow-medium" : "border-transparent opacity-70 hover:opacity-100 hover:border-border"}`}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover bg-white"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full relative bg-white rounded-radius-lg overflow-hidden shadow-soft group h-100 md:h-150 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage || images?.[0]?.url}
                  alt={title}
                  className="w-full h-full object-contain p-4"
                />
              </AnimatePresence>
              <button
                onClick={() => setIsWishlist(!isWishlist)}
                className="absolute top-4 right-4 p-3 bg-background-light/80 backdrop-blur-md rounded-full shadow-soft hover:bg-white hover:text-danger text-text-subtle transition-all z-10"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlist ? "fill-danger text-danger" : ""}`}
                />
              </button>

              {/* Tags Overlay */}
              {tags && tags.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {tags.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-primary-light text-white text-xs px-3 py-1.5 rounded-full teko tracking-wider uppercase shadow-soft w-max"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div
            className="w-full lg:w-1/2 flex flex-col animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="mb-2">
              <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                {brand}
              </span>
            </div>

            <h1 className="eczar text-4xl md:text-5xl lg:text-6xl text-text mb-4 leading-tight capitalize">
              {title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= ratingValue ? "fill-gold" : "fill-transparent border-gold"}`}
                  />
                ))}
              </div>
              <span className="mate text-text-subtle text-sm">
                ({ratingValue} Reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="teko text-5xl text-primary-dark font-medium">
                ₹{finalPrice || mrp}
              </span>
              {mrp && finalPrice && mrp > finalPrice && (
                <>
                  <span className="teko text-3xl text-text-subtle line-through opacity-70">
                    ₹{mrp}
                  </span>
                  <span className="bg-success-light/20 text-success-dark px-2 py-1 rounded-radius-sm teko text-lg">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="mate text-lg text-text-subtle mb-8 leading-relaxed">
              {shortDescription || description}
            </p>

            {/* Attributes (e.g. Color) */}
            {attributes && Object.keys(attributes).length > 0 && (
              <div className="mb-8">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <h3 className="mate font-semibold text-text mb-2 capitalize">
                      {key}:
                    </h3>
                    <div className="flex gap-3">
                      <div className="border-2 border-border bg-primary-light text-white px-4 py-2 rounded-radius-sm  font-medium capitalize shadow-soft">
                        {value as string}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <hr className="border-border/30 mb-8" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">


              <div className="flex flex-1 gap-4">
                <CartAction product={slugProduct} />

                <button className="flex-1 bg-primary text-white teko text-2xl px-4 py-3 rounded-radius-sm shadow-medium hover:bg-primary-light  transition-all flex items-center justify-center gap-2 group whitespace-nowrap">
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-8 mate text-sm">
              {stock > 0 ? (
                <div className="flex items-center gap-2 text-success-dark bg-success-light/20 w-max px-4 py-2 rounded-full font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                  In Stock ({stock} available)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-danger-dark bg-danger-light/20 w-max px-4 py-2 rounded-full font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                {
                  icon: Truck,
                  title: "Free Worldwide Shipping",
                  desc: "On all orders over ₹2000",
                },
                {
                  icon: ShieldCheck,
                  title: "1 Year Warranty",
                  desc: "Covered by our guarantee",
                },
                {
                  icon: RotateCcw,
                  title: "30 Days Return",
                  desc: "No questions asked",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure Checkout",
                  desc: "100% encrypted payment",
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-radius-md hover:bg-white/70 hover:border border-border transition-colors group"
                >
                  <div className="p-2 bg-white group-hover:bg-background text-primary rounded-full shadow-soft shrink-0 transition-colors">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="mate font-semibold text-text text-sm">
                      {feat.title}
                    </h4>
                    <p className="text-text-subtle text-xs mt-0.5">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-auto">
              <div className="flex border-b border-border/30 gap-8 mb-6">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 teko text-2xl tracking-wide capitalize relative transition-colors ${activeTab === tab ? "text-primary" : "text-text-subtle hover:text-text"}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-37.5">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mate text-text-subtle leading-relaxed text-lg"
                    >
                      <p>{description}</p>
                    </motion.div>
                  )}
                  {activeTab === "specifications" && (
                    <motion.div
                      key="specs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mate text-lg"
                    >
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <tr className="border-b border-border/20">
                            <th className="py-3 font-semibold text-text w-1/3">
                              Brand
                            </th>
                            <td className="py-3 text-text-subtle capitalize">
                              {brand}
                            </td>
                          </tr>
                          <tr className="border-b border-border/20">
                            <th className="py-3 font-semibold text-text w-1/3">
                              Category
                            </th>
                            <td className="py-3 text-text-subtle capitalize">
                              {category}
                            </td>
                          </tr>
                          {attributes &&
                            Object.entries(attributes).map(([k, v]) => (
                              <tr key={k} className="border-b border-border/20">
                                <th className="py-3 font-semibold text-text w-1/3 capitalize">
                                  {k}
                                </th>
                                <td className="py-3 text-text-subtle capitalize">
                                  {v as string}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mate text-text-subtle text-center py-8 bg-background-light/50 rounded-radius-md"
                    >
                      <Star className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
                      <p className="text-lg">
                        No reviews yet for this product.
                      </p>
                      <p className="text-sm mt-1">Be the first to review!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
