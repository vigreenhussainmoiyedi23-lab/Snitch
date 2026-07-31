import { useRef } from "react";
import { Upload, X } from "lucide-react";

type ImageUploaderProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

/**
 * Premium image upload area.
 * Inherits the dark card background (bg-text) from SectionCard.
 * Drop zone border and previews adapted for dark context.
 */
const ImageUploader = ({ images, setImages }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    if (arr.length + images.length > 5) {
      alert("You can only upload 5 images");
      return;
    }
    setImages((prev) => [...prev, ...arr]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {/* ── Drop Zone ── */}
      {images.length < 5 && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload images"
          className="border-2 border-dashed border-border rounded-[var(--radius-md)] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary-lighter transition-all duration-200 group"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Icon circle */}
          <div className="w-14 h-14 rounded-full bg-text-subtle border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
            <Upload className="w-6 h-6 text-primary" />
          </div>

          <p className="eczar text-sm font-semibold text-background mb-1 text-center">
            Click or drag images here to upload
          </p>
          <p className="mate text-xs text-background-subtle text-center mb-4">
            PNG, JPG, WEBP up to 5MB
          </p>
          <span className="teko text-xs tracking-widest text-primary border border-primary/40 bg-primary/10 px-5 py-1.5 rounded-full">
            {images.length} / 5 images
          </span>
        </div>
      )}

      {/* ── Hidden File Input ── */}
      <input
        ref={inputRef}
        id="images"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* ── Image Preview Grid ── */}
      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((image, idx) => (
            <div
              key={`${image.name}-${idx}`}
              className="relative group aspect-square rounded-[var(--radius-sm)] overflow-hidden border-2 border-border hover:border-primary transition-colors duration-200"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="w-full h-full object-cover"
              />

              {/* Cover badge — first image only */}
              {idx === 0 && (
                <div
                  className="absolute bottom-0 left-0 right-0 py-1 flex items-center justify-center"
                  style={{ background: "rgba(247,136,13,0.88)" }}
                >
                  <span className="teko text-[10px] tracking-widest text-white font-semibold leading-none">
                    COVER
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-danger-dark"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
