import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Heart } from "lucide-react";

interface Image {
  fileId?: string;
  url: string;
  _id?: string;
}

interface ImageGalleryProps {
  images: Image[];
  title?: string;
  tags?: string[];
}

const ImageGallery = ({ images, title, tags }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const currentIndex =
    images?.findIndex(
      (img) => img.url === (activeImage || images?.[0]?.url),
    ) ?? 0;
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;

  const goPrev = () => {
    if (!images?.length) return;
    const idx = (safeIndex - 1 + images.length) % images.length;
    setActiveImage(images[idx]?.url);
  };

  const goNext = () => {
    if (!images?.length) return;
    const idx = (safeIndex + 1) % images.length;
    setActiveImage(images[idx]?.url);
  };

  const [isWishlist, setIsWishlist] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4 h-full lg:sticky lg:top-24 animate-slide-in">
      {/* Thumbnails */}
      <div className="flex w-fit md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
        {images?.map((img, idx) => (
          <button
            key={img._id || img.fileId || idx}
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
      <div className="w-full relative bg-white rounded-radius-lg overflow-hidden shadow-soft group h-100 md:h-150 flex items-center justify-center min-w-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage || images?.[0]?.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={activeImage || images?.[0]?.url}
            alt={title}
            className="w-full h-full object-contain p-4"
          />
        </AnimatePresence>

        {/* Navigation Arrows - visible on group hover */}
        {images?.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-background/80 backdrop-blur-sm rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-medium active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-text" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-background/80 backdrop-blur-sm rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-medium active:scale-90"
            >
              <ChevronRight className="w-5 h-5 text-text" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images?.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(images[idx].url)}
                className={`h-1.5 rounded-full transition-all duration-200 ${idx === safeIndex ? "bg-primary w-4" : "bg-text/30 w-1.5 hover:bg-text/60"}`}
              />
            ))}
          </div>
        )}

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
            {tags.map((tag, idx) => (
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
  );
};

export default ImageGallery;
