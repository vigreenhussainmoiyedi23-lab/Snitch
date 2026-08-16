import { Check, Upload, X } from "lucide-react";
import { useProduct } from "../../hook/useProduct";
import { toast } from "react-toastify";
import type { product } from "../../types/product.type";
type Props={
    keep:string[];
    setKeep:React.Dispatch<React.SetStateAction<string[]>>;
    newImages:File[];
    setNewImages:React.Dispatch<React.SetStateAction<File[]>>;
    newImagePreviews:string[];
    setNewImagePreviews:React.Dispatch<React.SetStateAction<string[]>>;
    slugProduct:product
}
const ImagesSection = ({ keep, setKeep, newImages,setNewImages, newImagePreviews, setNewImagePreviews, slugProduct }:Props) => {
 
    const {
    UpdateProductsPatchHandler,
    GetProductThroughSlug,
  } = useProduct();
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
      GetProductThroughSlug(slugProduct.slug);
    } catch (err) {
      toast.error("Failed to update images");
    }
  };
  return (
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
  );
};

export default ImagesSection;
