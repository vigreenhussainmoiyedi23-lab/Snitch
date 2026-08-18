import { useState, useRef } from "react";
import { ImagePlus, Plus, Trash2, X, Tag, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { useProduct } from "../../hook/useProduct";
import { toast } from "react-toastify";
import Loading from "../../../../commonComponents/Loading";

/* ─── Local Types ───────────────────────────────────────── */
type ExistingImage = {
  fileId: string;
  url: string;
  thumbnailUrl: string;
};

type ExistingOption = {
  name: string;
  values: string[];
  imageMap: Record<string, ExistingImage[]>;
};

type RemoveEntry = {
  name: string;
  values: string[];
  fileId: string[];
};

type NewValueEntry = {
  optionName: string;
  value: string;
  files: File[];
  previews: string[];
};

type Props = {
  productId: string;
  slugProduct: any;
  onSuccess?: () => void;
};

/* ─── Component ────────────────────────────────────────── */
const UpdateOptions = ({ productId, slugProduct, onSuccess }: Props) => {
  if (!productId) return <Loading />;

  const { UpdateProductOptionsHandler, GetProductThroughSlug } = useProduct();

  // ── State ────────────────────────────────────────────
  const [removals, setRemovals] = useState<RemoveEntry[]>([]);
  const [newValues, setNewValues] = useState<NewValueEntry[]>([]);
  const [valueInputs, setValueInputs] = useState<Record<string, string>>({});
  const [expandedOptions, setExpandedOptions] = useState<Record<string, boolean>>({});
  const [addSections, setAddSections] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({});
  const [pendingPreviews, setPendingPreviews] = useState<Record<string, string[]>>({});

  const options: ExistingOption[] = slugProduct?.options ?? [];

  /* ── Collapse toggle ────────────────────────────────── */
  const toggleExpand = (name: string) =>
    setExpandedOptions((prev) => ({ ...prev, [name]: !prev[name] }));

  /* ── Mark a value for removal ───────────────────────── */
  const markRemove = (optionName: string, value: string, images: ExistingImage[]) => {
    setRemovals((prev) => {
      const existing = prev.find((r) => r.name === optionName);
      const fileIds = images?.map((img) => img.fileId) ?? [];
      if (existing) {
        if (existing.values.includes(value)) return prev;
        return prev.map((r) =>
          r.name === optionName
            ? { ...r, values: [...r.values, value], fileId: [...r.fileId, ...fileIds] }
            : r
        );
      }
      return [...prev, { name: optionName, values: [value], fileId: fileIds }];
    });
  };

  /* ── Undo a removal ─────────────────────────────────── */
  const undoRemove = (optionName: string, value: string) => {
    setRemovals((prev) =>
      prev
        .map((r) =>
          r.name === optionName ? { ...r, values: r.values.filter((v) => v !== value) } : r
        )
        .filter((r) => r.values.length > 0)
    );
  };

  const isMarkedForRemoval = (optionName: string, value: string) =>
    removals.some((r) => r.name === optionName && r.values.includes(value));

  /* ── Handle pending file selection ────────────────── */
  const handlePendingFileChange = (key: string, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const previews = arr.map((f) => URL.createObjectURL(f));
    setPendingFiles((prev) => ({ ...prev, [key]: arr }));
    setPendingPreviews((prev) => ({ ...prev, [key]: previews }));
  };

  const removePendingFile = (key: string, index: number) => {
    setPendingFiles((prev) => {
      const arr = [...(prev[key] ?? [])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
    setPendingPreviews((prev) => {
      const arr = [...(prev[key] ?? [])];
      URL.revokeObjectURL(arr[index]);
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
  };

  /* ── Add a new value entry ──────────────────────────── */
  const addNewValue = (optionName: string) => {
    const key = optionName;
    const inputVal = (valueInputs[key] ?? "").trim();
    if (!inputVal) {
      toast.error("Please enter a value name");
      return;
    }
    const existingOption = options.find((o) => o.name === optionName);
    if (existingOption?.values.includes(inputVal)) {
      toast.error("This value already exists in the option");
      return;
    }
    if (newValues.some((nv) => nv.optionName === optionName && nv.value === inputVal)) {
      toast.error("This value is already queued to be added");
      return;
    }
    const files = pendingFiles[key] ?? [];
    const previews = pendingPreviews[key] ?? [];
    setNewValues((prev) => [...prev, { optionName, value: inputVal, files, previews }]);
    setValueInputs((prev) => ({ ...prev, [key]: "" }));
    setPendingFiles((prev) => ({ ...prev, [key]: [] }));
    setPendingPreviews((prev) => ({ ...prev, [key]: [] }));
    if (fileRefs.current[key]) fileRefs.current[key]!.value = "";
  };

  /* ── Remove a queued new value ──────────────────────── */
  const removeNewValue = (optionName: string, value: string) => {
    setNewValues((prev) =>
      prev.filter((nv) => !(nv.optionName === optionName && nv.value === value))
    );
  };

  /* ── Submit ─────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (removals.length === 0 && newValues.length === 0) {
      toast.info("No changes to save");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();

    // Group new values by option name for `add` payload
    const addMap: Record<string, string[]> = {};
    newValues.forEach(({ optionName, value }) => {
      if (!addMap[optionName]) addMap[optionName] = [];
      addMap[optionName].push(value);
    });
    const addPayload = Object.entries(addMap).map(([name, values]) => ({ name, values }));
    formData.append("add", JSON.stringify(addPayload));
    formData.append("remove", JSON.stringify(removals));

    // Append files with fieldname "optionName:valueName"
    newValues.forEach(({ optionName, value, files }) => {
      files.forEach((file) => {
        formData.append(`${optionName}:${value}`, file);
      });
    });

    try {
      await UpdateProductOptionsHandler(productId, formData);
      toast.success("Options updated successfully!");
      setRemovals([]);
      setNewValues([]);
      setValueInputs({});
      setPendingFiles({});
      setPendingPreviews({});
      setAddSections({});
      if (onSuccess) onSuccess();
      if (slugProduct?.slug) GetProductThroughSlug(slugProduct.slug);
    } catch {
      toast.error("Failed to update options");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalChanges =
    removals.reduce((acc, r) => acc + r.values.length, 0) + newValues.length;

  /* ─── Render ──────────────────────────────────────── */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white eczar">Manage Options</h2>
          <p className="text-sm text-background-light/60 mt-1 mate">
            Add new values, remove existing values, or attach images to option variants.
          </p>
        </div>
        {totalChanges > 0 && (
          <span className="text-xs font-semibold bg-primary/20 text-primary-lighter border border-primary/30 px-3 py-1 rounded-full">
            {totalChanges} pending change{totalChanges > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* No options notice */}
      {options.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-border/40 gap-3">
          <Tag size={36} className="text-background-light/30" />
          <p className="text-background-light/50 text-sm mate">
            This product has no options yet.
          </p>
        </div>
      )}

      {/* Existing options list */}
      <div className="space-y-4">
        {options.map((option) => {
          const isExpanded = expandedOptions[option.name] !== false;
          const showAddSection = addSections[option.name] ?? false;
          const pendingKey = option.name;
          const queuedForThisOption = newValues.filter(
            (nv) => nv.optionName === option.name
          );

          return (
            <div
              key={option.name}
              className="rounded-xl border border-border/40 bg-text-mutes/30 overflow-hidden"
            >
              {/* Option accordion header */}
              <button
                type="button"
                onClick={() => toggleExpand(option.name)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-text-subtle/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="font-semibold text-white capitalize teko text-lg tracking-wide">
                    {option.name}
                  </span>
                  <span className="text-xs text-background-light/50 bg-background-light/10 px-2 py-0.5 rounded-full">
                    {option.values.length} value{option.values.length !== 1 ? "s" : ""}
                  </span>
                  {queuedForThisOption.length > 0 && (
                    <span className="text-xs text-success-light bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      +{queuedForThisOption.length} queued
                    </span>
                  )}
                  {removals.find((r) => r.name === option.name) && (
                    <span className="text-xs text-danger-light bg-danger/10 border border-danger/30 px-2 py-0.5 rounded-full">
                      -{removals.find((r) => r.name === option.name)!.values.length} removing
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-background-light/50" />
                ) : (
                  <ChevronDown size={18} className="text-background-light/50" />
                )}
              </button>

              {/* Option body */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-5 border-t border-border/20 pt-4">

                  {/* ── Existing values ──────────────── */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-background-light/40 mb-3 font-semibold">
                      Existing Values
                    </p>
                    {option.values.length === 0 ? (
                      <p className="text-xs text-background-light/30 italic">No values defined.</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                          const marked = isMarkedForRemoval(option.name, value);
                          const rawMapEntry = option.imageMap?.[value];
                          const imgs: ExistingImage[] = Array.isArray(rawMapEntry)
                            ? rawMapEntry
                            : rawMapEntry
                            ? [rawMapEntry as unknown as ExistingImage]
                            : [];
                          const previewImg = imgs[0];

                          return (
                            <div
                              key={value}
                              className={`relative group flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2 transition-all duration-200 ${
                                marked
                                  ? "border-danger/60 bg-danger/10 opacity-60 scale-95"
                                  : "border-border/50 bg-text/40"
                              }`}
                            >
                              {previewImg ? (
                                <img
                                  src={previewImg.thumbnailUrl || previewImg.url}
                                  alt={value}
                                  className="w-10 h-10 rounded-lg object-cover object-center"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-background-light/10 flex items-center justify-center">
                                  <ImagePlus size={14} className="text-background-light/30" />
                                </div>
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  marked
                                    ? "text-danger-light line-through"
                                    : "text-background-light"
                                }`}
                              >
                                {value}
                              </span>

                              {marked ? (
                                <button
                                  type="button"
                                  onClick={() => undoRemove(option.name, value)}
                                  className="absolute -top-2 -right-2 bg-background-subtle text-text text-[10px] rounded-full px-1.5 py-0.5 font-bold border border-border shadow-sm hover:bg-primary/10 transition-colors"
                                >
                                  undo
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => markRemove(option.name, value, imgs)}
                                  className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-dark"
                                  title={`Remove "${value}"`}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ── Queued new values ────────────── */}
                  {queuedForThisOption.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-success/70 mb-3 font-semibold">
                        Queued to Add
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {queuedForThisOption.map((nv) => (
                          <div
                            key={nv.value}
                            className="relative group flex flex-col items-center gap-1.5 rounded-xl border border-success/40 bg-success/10 px-3 py-2"
                          >
                            {nv.previews.length > 0 ? (
                              <img
                                src={nv.previews[0]}
                                alt={nv.value}
                                className="w-10 h-10 rounded-lg object-cover object-center"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                <Plus size={14} className="text-success/50" />
                              </div>
                            )}
                            <span className="text-xs font-medium text-success-light">
                              {nv.value}
                            </span>
                            {nv.files.length > 0 && (
                              <span className="text-[10px] text-success/60">
                                {nv.files.length} img
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeNewValue(option.name, nv.value)}
                              className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-dark"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Add new value panel ──────────── */}
                  {!showAddSection ? (
                    <button
                      type="button"
                      onClick={() =>
                        setAddSections((prev) => ({ ...prev, [option.name]: true }))
                      }
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors font-medium"
                    >
                      <Plus size={16} />
                      Add new value to "{option.name}"
                    </button>
                  ) : (
                    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">Add New Value</p>
                        <button
                          type="button"
                          onClick={() =>
                            setAddSections((prev) => ({ ...prev, [option.name]: false }))
                          }
                          className="text-background-light/40 hover:text-background-light transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Value name input */}
                      <input
                        type="text"
                        value={valueInputs[pendingKey] ?? ""}
                        onChange={(e) =>
                          setValueInputs((prev) => ({
                            ...prev,
                            [pendingKey]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNewValue(option.name);
                          }
                        }}
                        placeholder={`e.g. Red, XL, Cotton…`}
                        className="w-full h-10 bg-background border border-border rounded-lg px-3 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />

                      {/* Image uploader */}
                      <div>
                        <label
                          htmlFor={`img-upload-${option.name}`}
                          className="group inline-flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm text-text/60 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                        >
                          <Upload
                            size={15}
                            className="transition-transform group-hover:-translate-y-0.5"
                          />
                          Upload images (optional)
                        </label>
                        <input
                          ref={(el) => {
                            fileRefs.current[pendingKey] = el;
                          }}
                          id={`img-upload-${option.name}`}
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) =>
                            handlePendingFileChange(pendingKey, e.target.files)
                          }
                        />

                        {/* Pending file previews */}
                        {(pendingPreviews[pendingKey] ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(pendingPreviews[pendingKey] ?? []).map((src, i) => (
                              <div
                                key={i}
                                className="relative w-14 h-14 rounded-lg overflow-hidden border border-border"
                              >
                                <img
                                  src={src}
                                  alt="preview"
                                  className="w-full h-full object-cover object-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePendingFile(pendingKey, i)}
                                  className="absolute top-0.5 right-0.5 bg-danger text-white rounded-full p-0.5 hover:bg-danger-dark transition-colors"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Confirm button */}
                      <button
                        type="button"
                        onClick={() => addNewValue(option.name)}
                        className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors active:scale-95"
                      >
                        <Plus size={15} />
                        Queue Value
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Change summary */}
      {(removals.length > 0 || newValues.length > 0) && (
        <div className="rounded-xl border border-border/30 bg-text-mutes/20 px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-white mb-3">Change Summary</p>
          {removals.map((r) =>
            r.values.map((v) => (
              <div
                key={`${r.name}-${v}`}
                className="flex items-center gap-2 text-xs text-danger-light"
              >
                <Trash2 size={12} />
                Remove{" "}
                <span className="font-semibold">{r.name}</span> →{" "}
                <span className="font-semibold">{v}</span>
              </div>
            ))
          )}
          {newValues.map((nv) => (
            <div
              key={`${nv.optionName}-${nv.value}`}
              className="flex items-center gap-2 text-xs text-success-light"
            >
              <Plus size={12} />
              Add <span className="font-semibold">{nv.optionName}</span> →{" "}
              <span className="font-semibold">{nv.value}</span>
              {nv.files.length > 0 && (
                <span className="text-success/60 ml-1">
                  ({nv.files.length} image{nv.files.length > 1 ? "s" : ""})
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || totalChanges === 0}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
          totalChanges === 0 || isSubmitting
            ? "bg-background-light/20 text-background-light/40 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark text-white shadow-medium active:scale-95"
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <Upload size={15} />
            Save Option Changes
          </>
        )}
      </button>
    </div>
  );
};

export default UpdateOptions;
