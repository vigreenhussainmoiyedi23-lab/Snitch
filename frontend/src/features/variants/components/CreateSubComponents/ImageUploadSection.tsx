import React, { useRef } from "react";
import { Plus, X, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

interface ImageUploadSectionProps {
  previews: string[];
  fileError: string;
  onFilesChange: (files: File[]) => void;
  onFileErrorChange: (error: string) => void;
  onRemovePreview: (index: number) => void;
  label?: string;
  maxFiles?: number;
  maxSize?: number;
  buttonText?: string;
  compact?: boolean;
}

const validateFiles = (files: FileList, maxFiles: number, maxSize: number): { valid: File[]; error: string } => {
  const valid: File[] = [];
  for (const file of Array.from(files)) {
    if (file.size > maxSize)
      return { valid, error: `"${file.name}" exceeds the ${maxSize / (1024 * 1024)} MB limit` };
    if (!file.type.startsWith("image/"))
      return { valid, error: `"${file.name}" is not an image file` };
    valid.push(file);
    if (valid.length === maxFiles) break;
  }
  return { valid, error: "" };
};

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  previews,
  fileError,
  onFilesChange,
  onFileErrorChange,
  onRemovePreview,
  label = "Images",
  maxFiles = MAX_FILES,
  maxSize = MAX_FILE_SIZE,
  buttonText = "Click to upload images",
  compact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const { valid, error } = validateFiles(e.target.files, maxFiles, maxSize);
    onFilesChange(valid);
    onFileErrorChange(error);
  };

  return (
    <div>
      <label className="mate text-xs text-text-subtle block mb-2">
        {label}{" "}
        <span className="text-text-subtle/60">
          (max {maxFiles}, {maxSize / (1024 * 1024)} MB each)
        </span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed border-border/40 rounded-radius-sm text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition group ${compact ? "p-3" : "p-5"}`}
      >
        {!compact && (
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition">
            <Plus className="w-4 h-4 text-primary" />
          </div>
        )}
        <p className={`mate ${compact ? "text-xs" : "text-sm"} text-text-subtle`}>
          {compact ? "+ Upload new images" : buttonText}
        </p>
        {!compact && (
          <p className="mate text-xs text-text-subtle/60 mt-1">
            PNG, JPG, WEBP - max {maxSize / (1024 * 1024)} MB each
          </p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />
      {fileError && (
        <p className="mate text-xs text-danger mt-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {fileError}
        </p>
      )}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative w-16 h-16 rounded-radius-sm overflow-hidden border border-border/30 group/img"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => onRemovePreview(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
