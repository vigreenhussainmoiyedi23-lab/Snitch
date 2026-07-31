import { X } from "lucide-react";

const UploadImages = ({images,setImages}:{
    images:File[],
    setImages:React.Dispatch<React.SetStateAction<File[]>>
}) => {
  return (
    <div>
      <h2 className="text-background   text-sm font-serif  mb-4 ">
        Product Images
      </h2>
      {images.length > 0 && (
        <div
          className={
            "flex-wrap py-2 flex gap-5 " + (images.length === 5 ? "w-full" : "")
          }
        >
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
      )}
      {images.length < 5 && (
        <label
          htmlFor="images"
          className="border-2 w-full mb-5 border-dashed border-border rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-primary transition"
        >
          <span className="text-background">Click or Drag Images Here</span>
        </label>
      )}
      <input
        id="images"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (!e.target.files) return;

          const files = Array.from(e.target.files);
          if (files.length + images.length > 5)
            return alert("You can only upload 5 images");
          setImages((prev) => [...prev, ...files]);

          // Allows selecting same file again
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default UploadImages;
