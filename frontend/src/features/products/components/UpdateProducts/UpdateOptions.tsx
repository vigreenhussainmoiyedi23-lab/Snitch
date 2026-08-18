import { useState, useRef } from "react";
import {
  ImagePlus,
  Plus,
  Trash2,
  X,
  Tag,
  ChevronDown,
  ChevronUp,
  Upload,
  PackagePlus,
  AlertTriangle,
} from "lucide-react";
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
  imageMap: Record<string, ExistingImage | ExistingImage[]>;
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

/* A brand-new option (doesn't exist on the product yet) */
type NewOptionDraft = {
  id: string; // local uid
  name: string;
  values: NewValueEntry[];
  /* value input state for this draft option */
  valueInput: string;
  pendingFiles: File[];
  pendingPreviews: string[];
};

type Props = {
  productId: string;
  slugProduct: any;
  onSuccess?: () => void;
};

/* ─── Helpers ─────────────────────────────────────────── */
function uid() {
  return Math.random().toString(36).slice(2);
}

function resolveImages(entry: ExistingImage | ExistingImage[] | undefined): ExistingImage[] {
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
}

/* ─── Component ────────────────────────────────────────── */
const UpdateOptions = ({ productId, slugProduct, onSuccess }: Props) => {
  if (!productId) return <Loading />;

  const { UpdateProductOptionsHandler, GetProductThroughSlug } = useProduct();

  /* ── State ──────────────────────────────────────────── */
  const [removals, setRemovals] = useState<RemoveEntry[]>([]);
  const [newValues, setNewValues] = useState<NewValueEntry[]>([]);

  // per-existing-option UI
  const [expandedOptions, setExpandedOptions] = useState<Record<string, boolean>>({});
  const [addSections, setAddSections] = useState<Record<string, boolean>>({});
  const [valueInputs, setValueInputs] = useState<Record<string, string>>({});
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({});
  const [pendingPreviews, setPendingPreviews] = useState<Record<string, string[]>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // brand-new options
  const [newOptionDrafts, setNewOptionDrafts] = useState<NewOptionDraft[]>([]);
  const [showAddOption, setShowAddOption] = useState(false);
  const newOptionFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const options: ExistingOption[] = slugProduct?.options ?? [];

  /* ────────────────────────────────────────────────────── */
  /*  EXISTING OPTIONS — helpers                           */
  /* ────────────────────────────────────────────────────── */

  const toggleExpand = (name: string) =>
    setExpandedOptions((p) => ({ ...p, [name]: !p[name] }));

  const isMarkedForRemoval = (optionName: string, value: string) =>
    removals.some((r) => r.name === optionName && r.values.includes(value));

  const isWholeOptionRemoved = (optionName: string) => {
    const entry = removals.find((r) => r.name === optionName);
    if (!entry) return false;
    const option = options.find((o) => o.name === optionName);
    return option ? entry.values.length === option.values.length : false;
  };

  /* Mark one value for removal */
  const markRemove = (
    optionName: string,
    value: string,
    imgs: ExistingImage[]
  ) => {
    setRemovals((prev) => {
      const existing = prev.find((r) => r.name === optionName);
      const fileIds = imgs.map((img) => img.fileId);
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

  /* Mark ALL values of an option for removal in one click */
  const markWholeOptionRemoved = (option: ExistingOption) => {
    const allFileIds = option.values.flatMap(
      (v) => resolveImages(option.imageMap?.[v]).map((img) => img.fileId)
    );
    setRemovals((prev) => {
      const filtered = prev.filter((r) => r.name !== option.name);
      return [...filtered, { name: option.name, values: [...option.values], fileId: allFileIds }];
    });
  };

  /* Undo one value removal */
  const undoRemove = (optionName: string, value: string) => {
    setRemovals((prev) =>
      prev
        .map((r) =>
          r.name === optionName
            ? { ...r, values: r.values.filter((v) => v !== value) }
            : r
        )
        .filter((r) => r.values.length > 0)
    );
  };

  /* Undo the entire option removal */
  const undoWholeOptionRemoval = (optionName: string) => {
    setRemovals((prev) => prev.filter((r) => r.name !== optionName));
  };

  /* ── Pending file helpers (for existing option "add value" panel) */
  const handlePendingFileChange = (key: string, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setPendingFiles((p) => ({ ...p, [key]: arr }));
    setPendingPreviews((p) => ({ ...p, [key]: arr.map((f) => URL.createObjectURL(f)) }));
  };

  const removePendingFile = (key: string, i: number) => {
    setPendingFiles((p) => {
      const arr = [...(p[key] ?? [])];
      arr.splice(i, 1);
      return { ...p, [key]: arr };
    });
    setPendingPreviews((p) => {
      const arr = [...(p[key] ?? [])];
      URL.revokeObjectURL(arr[i]);
      arr.splice(i, 1);
      return { ...p, [key]: arr };
    });
  };

  /* Queue a new value on an existing option */
  const queueValue = (optionName: string) => {
    const inputVal = (valueInputs[optionName] ?? "").trim();
    if (!inputVal) { toast.error("Enter a value name"); return; }
    const opt = options.find((o) => o.name === optionName);
    if (opt?.values.includes(inputVal)) { toast.error("Value already exists"); return; }
    if (newValues.some((nv) => nv.optionName === optionName && nv.value === inputVal)) {
      toast.error("Already queued"); return;
    }
    const files = pendingFiles[optionName] ?? [];
    const previews = pendingPreviews[optionName] ?? [];
    setNewValues((p) => [...p, { optionName, value: inputVal, files, previews }]);
    setValueInputs((p) => ({ ...p, [optionName]: "" }));
    setPendingFiles((p) => ({ ...p, [optionName]: [] }));
    setPendingPreviews((p) => ({ ...p, [optionName]: [] }));
    if (fileRefs.current[optionName]) fileRefs.current[optionName]!.value = "";
  };

  const dequeueValue = (optionName: string, value: string) =>
    setNewValues((p) => p.filter((nv) => !(nv.optionName === optionName && nv.value === value)));

  /* ────────────────────────────────────────────────────── */
  /*  BRAND-NEW OPTIONS — helpers                          */
  /* ────────────────────────────────────────────────────── */

  const addNewOptionDraft = () => {
    setNewOptionDrafts((p) => [
      ...p,
      { id: uid(), name: "", values: [], valueInput: "", pendingFiles: [], pendingPreviews: [] },
    ]);
  };

  const removeNewOptionDraft = (id: string) => {
    setNewOptionDrafts((p) => p.filter((d) => d.id !== id));
  };

  const updateDraftField = (id: string, field: "name" | "valueInput", val: string) =>
    setNewOptionDrafts((p) => p.map((d) => (d.id === id ? { ...d, [field]: val } : d)));

  const handleNewOptionFileChange = (id: string, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewOptionDrafts((p) =>
      p.map((d) =>
        d.id === id
          ? { ...d, pendingFiles: arr, pendingPreviews: arr.map((f) => URL.createObjectURL(f)) }
          : d
      )
    );
  };

  const removeNewOptionPendingFile = (id: string, i: number) => {
    setNewOptionDrafts((p) =>
      p.map((d) => {
        if (d.id !== id) return d;
        const files = [...d.pendingFiles];
        const previews = [...d.pendingPreviews];
        URL.revokeObjectURL(previews[i]);
        files.splice(i, 1);
        previews.splice(i, 1);
        return { ...d, pendingFiles: files, pendingPreviews: previews };
      })
    );
  };

  const queueDraftValue = (id: string) => {
    setNewOptionDrafts((p) =>
      p.map((d) => {
        if (d.id !== id) return d;
        const val = d.valueInput.trim();
        if (!val) { toast.error("Enter a value name"); return d; }
        if (d.values.some((v) => v.value === val)) { toast.error("Already added"); return d; }
        // Also check existing options to avoid collision
        const sameOption = options.find((o) => o.name.toLowerCase() === d.name.toLowerCase());
        if (sameOption?.values.includes(val)) { toast.error("Value already exists on the product"); return d; }
        return {
          ...d,
          values: [
            ...d.values,
            { optionName: d.name, value: val, files: d.pendingFiles, previews: d.pendingPreviews },
          ],
          valueInput: "",
          pendingFiles: [],
          pendingPreviews: [],
        };
      })
    );
    const draft = newOptionDrafts.find((d) => d.id === id);
    if (draft && newOptionFileRefs.current[id]) newOptionFileRefs.current[id]!.value = "";
  };

  const dequeueDraftValue = (draftId: string, value: string) => {
    setNewOptionDrafts((p) =>
      p.map((d) =>
        d.id === draftId ? { ...d, values: d.values.filter((v) => v.value !== value) } : d
      )
    );
  };

  /* ────────────────────────────────────────────────────── */
  /*  SUBMIT                                               */
  /* ────────────────────────────────────────────────────── */

  const handleSubmit = async () => {
    // validate new option drafts have a name + at least 1 value
    const invalidDrafts = newOptionDrafts.filter((d) => !d.name.trim() || d.values.length === 0);
    if (invalidDrafts.length > 0) {
      toast.error("Each new option needs a name and at least one value");
      return;
    }
    const totalChanges =
      removals.reduce((a, r) => a + r.values.length, 0) +
      newValues.length +
      newOptionDrafts.reduce((a, d) => a + d.values.length, 0);

    if (totalChanges === 0) { toast.info("No changes to save"); return; }

    setIsSubmitting(true);
    const formData = new FormData();

    /* ── build `add` payload ──────────────────────────── */
    // existing-option new values
    const addMap: Record<string, string[]> = {};
    newValues.forEach(({ optionName, value }) => {
      (addMap[optionName] = addMap[optionName] ?? []).push(value);
    });
    // brand-new options
    newOptionDrafts.forEach((d) => {
      const name = d.name.trim();
      if (!name) return;
      addMap[name] = [...(addMap[name] ?? []), ...d.values.map((v) => v.value)];
    });
    const addPayload = Object.entries(addMap).map(([name, values]) => ({ name, values }));
    formData.append("add", JSON.stringify(addPayload));

    /* ── build `remove` payload ────────────────────────── */
    formData.append("remove", JSON.stringify(removals));

    /* ── append files ──────────────────────────────────── */
    // files for new values on existing options
    newValues.forEach(({ optionName, value, files }) =>
      files.forEach((f) => formData.append(`${optionName}:${value}`, f))
    );
    // files for values on brand-new options
    newOptionDrafts.forEach((d) =>
      d.values.forEach(({ optionName, value, files }) =>
        files.forEach((f) => formData.append(`${optionName || d.name.trim()}:${value}`, f))
      )
    );

    try {
      await UpdateProductOptionsHandler(productId, formData);
      toast.success("Options updated successfully!");
      setRemovals([]);
      setNewValues([]);
      setValueInputs({});
      setPendingFiles({});
      setPendingPreviews({});
      setAddSections({});
      setNewOptionDrafts([]);
      setShowAddOption(false);
      if (onSuccess) onSuccess();
      if (slugProduct?.slug) GetProductThroughSlug(slugProduct.slug);
    } catch {
      toast.error("Failed to update options");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─── derived counts ──────────────────────────────────── */
  const totalChanges =
    removals.reduce((a, r) => a + r.values.length, 0) +
    newValues.length +
    newOptionDrafts.reduce((a, d) => a + d.values.length, 0);

  /* ────────────────────────────────────────────────────── */
  /*  RENDER                                               */
  /* ────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white eczar">Manage Options</h2>
          <p className="text-sm text-background-light/60 mt-1 mate">
            Add or remove option values, attach images, or create entirely new options.
          </p>
        </div>
        {totalChanges > 0 && (
          <span className="text-xs font-semibold bg-primary/20 text-primary-lighter border border-primary/30 px-3 py-1 rounded-full">
            {totalChanges} pending change{totalChanges > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Empty state ─────────────────────────────────── */}
      {options.length === 0 && newOptionDrafts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border/40 gap-3">
          <Tag size={34} className="text-background-light/30" />
          <p className="text-background-light/50 text-sm mate">No options yet. Add one below.</p>
        </div>
      )}

      {/* ── Existing options list ───────────────────────── */}
      <div className="space-y-3">
        {options.map((option) => {
          const isExpanded = expandedOptions[option.name] !== false;
          const showAdd = addSections[option.name] ?? false;
          const queued = newValues.filter((nv) => nv.optionName === option.name);
          const removalEntry = removals.find((r) => r.name === option.name);
          const wholeRemoved = isWholeOptionRemoved(option.name);

          return (
            <div
              key={option.name}
              className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                wholeRemoved
                  ? "border-danger/50 bg-danger/5 opacity-60"
                  : "border-border/40 bg-text-mutes/30"
              }`}
            >
              {/* Accordion header */}
              <div className="flex items-center justify-between px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleExpand(option.name)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      wholeRemoved ? "bg-danger" : "bg-primary"
                    }`}
                  />
                  <span
                    className={`font-semibold capitalize teko text-lg tracking-wide ${
                      wholeRemoved ? "text-danger-light line-through" : "text-white"
                    }`}
                  >
                    {option.name}
                  </span>
                  <span className="text-xs text-background-light/50 bg-background-light/10 px-2 py-0.5 rounded-full">
                    {option.values.length} value{option.values.length !== 1 ? "s" : ""}
                  </span>
                  {queued.length > 0 && (
                    <span className="text-xs text-success-light bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      +{queued.length}
                    </span>
                  )}
                  {removalEntry && !wholeRemoved && (
                    <span className="text-xs text-danger-light bg-danger/10 border border-danger/30 px-2 py-0.5 rounded-full">
                      -{removalEntry.values.length}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp size={17} className="text-background-light/40 ml-auto" />
                  ) : (
                    <ChevronDown size={17} className="text-background-light/40 ml-auto" />
                  )}
                </button>

                {/* Remove whole option / Undo */}
                {wholeRemoved ? (
                  <button
                    type="button"
                    onClick={() => undoWholeOptionRemoval(option.name)}
                    className="ml-3 shrink-0 text-xs font-bold bg-background-subtle text-text border border-border px-2.5 py-1 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    Undo
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markWholeOptionRemoved(option)}
                    title={`Remove entire "${option.name}" option`}
                    className="ml-3 shrink-0 flex items-center gap-1.5 text-xs font-semibold text-danger-light border border-danger/30 bg-danger/10 px-2.5 py-1 rounded-full hover:bg-danger/20 transition-colors"
                  >
                    <Trash2 size={12} />
                    Remove option
                  </button>
                )}
              </div>

              {/* Whole-option removed banner */}
              {wholeRemoved && (
                <div className="flex items-center gap-2 px-5 py-2 bg-danger/10 text-xs text-danger-light border-t border-danger/20">
                  <AlertTriangle size={13} />
                  This entire option will be deleted on save.
                  <button
                    type="button"
                    onClick={() => undoWholeOptionRemoval(option.name)}
                    className="underline ml-1 hover:text-white transition-colors"
                  >
                    Undo
                  </button>
                </div>
              )}

              {/* Option body */}
              {isExpanded && !wholeRemoved && (
                <div className="px-5 pb-5 pt-4 space-y-5 border-t border-border/20">

                  {/* ── Existing values ──── */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-background-light/40 mb-3 font-semibold">
                      Current Values
                    </p>
                    {option.values.length === 0 ? (
                      <p className="text-xs text-background-light/30 italic">No values.</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {option.values.map((value) => {
                          const marked = isMarkedForRemoval(option.name, value);
                          const imgs = resolveImages(option.imageMap?.[value]);
                          const thumb = imgs[0];
                          return (
                            <div
                              key={value}
                              className={`relative group flex flex-col items-center gap-1.5 rounded-xl border px-3 py-2 transition-all duration-200 ${
                                marked
                                  ? "border-danger/60 bg-danger/10 opacity-60 scale-95"
                                  : "border-border/50 bg-text/40"
                              }`}
                            >
                              {thumb ? (
                                <img
                                  src={thumb.thumbnailUrl || thumb.url}
                                  alt={value}
                                  className="w-10 h-10 rounded-lg object-cover object-center"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-background-light/10 flex items-center justify-center">
                                  <ImagePlus size={13} className="text-background-light/30" />
                                </div>
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  marked ? "text-danger-light line-through" : "text-background-light"
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

                  {/* ── Queued new values (chips) ──── */}
                  {queued.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-success/70 mb-3 font-semibold">
                        Queued to Add
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {queued.map((nv) => (
                          <div
                            key={nv.value}
                            className="relative group flex flex-col items-center gap-1.5 rounded-xl border border-success/40 bg-success/10 px-3 py-2"
                          >
                            {nv.previews[0] ? (
                              <img
                                src={nv.previews[0]}
                                alt={nv.value}
                                className="w-10 h-10 rounded-lg object-cover object-center"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                                <Plus size={13} className="text-success/50" />
                              </div>
                            )}
                            <span className="text-xs font-medium text-success-light">{nv.value}</span>
                            {nv.files.length > 0 && (
                              <span className="text-[10px] text-success/60">{nv.files.length} img</span>
                            )}
                            <button
                              type="button"
                              onClick={() => dequeueValue(option.name, nv.value)}
                              className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-dark"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Add value panel / toggle ──── */}
                  {!showAdd ? (
                    <button
                      type="button"
                      onClick={() => setAddSections((p) => ({ ...p, [option.name]: true }))}
                      className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light transition-colors font-medium"
                    >
                      <Plus size={15} />
                      Add value to "{option.name}"
                    </button>
                  ) : (
                    <AddValuePanel
                      label={`Add value to "${option.name}"`}
                      inputValue={valueInputs[option.name] ?? ""}
                      onInputChange={(v) => setValueInputs((p) => ({ ...p, [option.name]: v }))}
                      onEnter={() => queueValue(option.name)}
                      onConfirm={() => queueValue(option.name)}
                      onClose={() => setAddSections((p) => ({ ...p, [option.name]: false }))}
                      pendingPreviews={pendingPreviews[option.name] ?? []}
                      onFileChange={(files) => handlePendingFileChange(option.name, files)}
                      onRemoveFile={(i) => removePendingFile(option.name, i)}
                      fileInputRef={(el) => { fileRefs.current[option.name] = el; }}
                      fileInputId={`fup-exist-${option.name}`}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Brand-new option drafts ──────────────────────── */}
      {newOptionDrafts.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary/60 font-semibold">
            New Options to Create
          </p>
          {newOptionDrafts.map((draft) => (
            <div
              key={draft.id}
              className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden"
            >
              {/* Draft header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-primary/15">
                <div className="flex items-center gap-2">
                  <PackagePlus size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {draft.name.trim() || "Unnamed option"}
                  </span>
                  {draft.values.length > 0 && (
                    <span className="text-xs text-success-light bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      {draft.values.length} value{draft.values.length > 1 ? "s" : ""} queued
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeNewOptionDraft(draft.id)}
                  className="text-background-light/40 hover:text-danger-light transition-colors"
                  title="Discard this new option"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Draft body */}
              <div className="px-5 py-4 space-y-4">
                {/* Option name */}
                <div>
                  <label className="block text-xs font-semibold text-background-light/50 uppercase tracking-widest mb-1.5">
                    Option Name
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => updateDraftField(draft.id, "name", e.target.value)}
                    placeholder="e.g. Size, Color, Material…"
                    className="w-full h-10 bg-background border border-border rounded-lg px-3 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Queued values for draft */}
                {draft.values.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {draft.values.map((nv) => (
                      <div
                        key={nv.value}
                        className="relative group flex flex-col items-center gap-1.5 rounded-xl border border-success/40 bg-success/10 px-3 py-2"
                      >
                        {nv.previews[0] ? (
                          <img
                            src={nv.previews[0]}
                            alt={nv.value}
                            className="w-10 h-10 rounded-lg object-cover object-center"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Plus size={13} className="text-success/50" />
                          </div>
                        )}
                        <span className="text-xs font-medium text-success-light">{nv.value}</span>
                        {nv.files.length > 0 && (
                          <span className="text-[10px] text-success/60">{nv.files.length} img</span>
                        )}
                        <button
                          type="button"
                          onClick={() => dequeueDraftValue(draft.id, nv.value)}
                          className="absolute -top-2 -right-2 bg-danger text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger-dark"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add value to draft */}
                <AddValuePanel
                  label="Queue a value"
                  inputValue={draft.valueInput}
                  onInputChange={(v) => updateDraftField(draft.id, "valueInput", v)}
                  onEnter={() => queueDraftValue(draft.id)}
                  onConfirm={() => queueDraftValue(draft.id)}
                  onClose={undefined}
                  pendingPreviews={draft.pendingPreviews}
                  onFileChange={(files) => handleNewOptionFileChange(draft.id, files)}
                  onRemoveFile={(i) => removeNewOptionPendingFile(draft.id, i)}
                  fileInputRef={(el) => { newOptionFileRefs.current[draft.id] = el; }}
                  fileInputId={`fup-new-${draft.id}`}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add new option button ────────────────────────── */}
      <button
        type="button"
        onClick={addNewOptionDraft}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-colors text-sm font-semibold"
      >
        <PackagePlus size={17} />
        Add a new option
      </button>

      {/* ── Change Summary ───────────────────────────────── */}
      {totalChanges > 0 && (
        <div className="rounded-xl border border-border/30 bg-text-mutes/20 px-5 py-4 space-y-1.5">
          <p className="text-sm font-semibold text-white mb-3">Change Summary</p>

          {removals.map((r) =>
            r.values.map((v) => (
              <div key={`rm-${r.name}-${v}`} className="flex items-center gap-2 text-xs text-danger-light">
                <Trash2 size={11} />
                Remove <span className="font-semibold">{r.name}</span> →{" "}
                <span className="font-semibold">{v}</span>
              </div>
            ))
          )}

          {newValues.map((nv) => (
            <div key={`add-${nv.optionName}-${nv.value}`} className="flex items-center gap-2 text-xs text-success-light">
              <Plus size={11} />
              Add to <span className="font-semibold">{nv.optionName}</span> →{" "}
              <span className="font-semibold">{nv.value}</span>
              {nv.files.length > 0 && (
                <span className="text-success/60 ml-1">({nv.files.length} img)</span>
              )}
            </div>
          ))}

          {newOptionDrafts.map((d) =>
            d.values.map((nv) => (
              <div key={`new-${d.id}-${nv.value}`} className="flex items-center gap-2 text-xs text-primary-lighter">
                <PackagePlus size={11} />
                New option <span className="font-semibold">{d.name || "?"}</span> →{" "}
                <span className="font-semibold">{nv.value}</span>
                {nv.files.length > 0 && (
                  <span className="text-primary/60 ml-1">({nv.files.length} img)</span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Save button ──────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || totalChanges === 0}
        className={`flex items-center gap-2 px-7 py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${
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

/* ─────────────────────────────────────────────────────────
   Reusable "add value" inline panel (existing + draft use it)
───────────────────────────────────────────────────────── */
type AddValuePanelProps = {
  label: string;
  inputValue: string;
  onInputChange: (v: string) => void;
  onEnter: () => void;
  onConfirm: () => void;
  onClose?: () => void;
  pendingPreviews: string[];
  onFileChange: (files: FileList | null) => void;
  onRemoveFile: (i: number) => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  fileInputId: string;
  compact?: boolean;
};

const AddValuePanel = ({
  label,
  inputValue,
  onInputChange,
  onEnter,
  onConfirm,
  onClose,
  pendingPreviews,
  onFileChange,
  onRemoveFile,
  fileInputRef,
  fileInputId,
  compact = false,
}: AddValuePanelProps) => (
  <div
    className={`space-y-3 ${
      compact
        ? ""
        : "rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4"
    }`}
  >
    {!compact && (
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary">{label}</p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-background-light/40 hover:text-background-light transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )}

    {/* Input row */}
    <div className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } }}
        placeholder="Enter a value… (Enter to queue)"
        className="flex-1 h-10 bg-background border border-border rounded-lg px-3 text-sm text-text outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
      <label
        htmlFor={fileInputId}
        className="group flex items-center gap-1.5 h-10 cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 text-sm text-text/60 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-200 shrink-0"
      >
        <Upload size={14} className="transition-transform group-hover:-translate-y-0.5" />
        <span className="hidden sm:inline">Image</span>
      </label>
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onFileChange(e.target.files)}
      />
      <button
        type="button"
        onClick={onConfirm}
        className="flex items-center gap-1.5 px-4 h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors active:scale-95 shrink-0"
      >
        <Plus size={15} />
        Queue
      </button>
    </div>

    {/* Pending image previews */}
    {pendingPreviews.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {pendingPreviews.map((src, i) => (
          <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
            <img src={src} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemoveFile(i)}
              className="absolute top-0.5 right-0.5 bg-danger text-white rounded-full p-0.5 hover:bg-danger-dark transition-colors"
            >
              <X size={9} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default UpdateOptions;
