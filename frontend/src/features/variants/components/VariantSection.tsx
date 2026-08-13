import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useVariant } from "../hooks/useVariant";
import { useAppSelector } from "../../../app/redux/hook";
import api from "../../../app/axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

interface VariantSectionProps {
  productId: string;
  isAdmin: boolean;
  onRefresh: () => void;
  selectedVariant: any;
  selectedVariantId: any;
  setSelectedVariantId: any;
}
const getAttrsObj = (v: any): Record<string, string> => {
  if (!v?.attributes) return {};
  if (v.attributes instanceof Map) return Object.fromEntries(v.attributes);
  if (typeof v.attributes === "object")
    return v.attributes as Record<string, string>;
  return {};
};

const validateFiles = (files: FileList): { valid: File[]; error: string } => {
  const valid: File[] = [];
  for (const file of Array.from(files)) {
    if (file.size > MAX_FILE_SIZE)
      return { valid, error: `"${file.name}" exceeds the 5 MB limit` };
    if (!file.type.startsWith("image/"))
      return { valid, error: `"${file.name}" is not an image file` };
    valid.push(file);
    if (valid.length === MAX_FILES) break;
  }
  return { valid, error: "" };
};

const VariantSection: React.FC<VariantSectionProps> = ({
  productId,
  isAdmin,
  onRefresh,
  selectedVariant,
  setSelectedVariantId
}) => {
  const { CreateVariantHandler, UpdateVariantHandler, DeleteVariantHandler } =
    useVariant();
  const variants = useAppSelector((s) => s.variant.variants);
  const loading = useAppSelector((s) => s.variant.loading);

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
    {},
  );

  const allKeys = [
    ...new Set(variants.flatMap((v) => Object.keys(getAttrsObj(v)))),
  ];

  const getAvailableValues = (
    key: string,
    baseSelections: Record<string, string>,
  ): string[] => {
    const others = Object.entries(baseSelections).filter(
      ([k, val]) => k !== key && !!val,
    );
    const filtered = variants.filter((v) => {
      const attrs = getAttrsObj(v);
      return others.every(([k, val]) => attrs[k] === val);
    });
    return [
      ...new Set(
        filtered
          .map((v) => getAttrsObj(v)[key])
          .filter((x): x is string => !!x),
      ),
    ];
  };

  const handleSelectAttr = (key: string, value: string) => {
    const isDeselecting = selectedAttrs[key] === value;
    const cascaded: Record<string, string> = {
      [key]: isDeselecting ? "" : value,
    };
    allKeys
      .filter((k) => k !== key)
      .forEach((otherKey) => {
        const prev = selectedAttrs[otherKey];
        const available = getAvailableValues(otherKey, cascaded);
        cascaded[otherKey] = available.includes(prev) ? prev : "";
      });
    setSelectedAttrs(cascaded);
    const matched = variants.find((v) => {
      const attrs = getAttrsObj(v);
      return allKeys.every((k) => !cascaded[k] || attrs[k] === cascaded[k]);
    });
    setSelectedVariantId(matched?._id || null);
  };

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    mrp: "",
    discount: "",
    stock: "",
    attributes: [{ key: "", value: "" }],
    images: [] as File[],
  });
  const [createPreviews, setCreatePreviews] = useState<string[]>([]);
  const [createFileError, setCreateFileError] = useState("");
  const createInputRef = useRef<HTMLInputElement>(null);

  const handleCreateImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const { valid, error } = validateFiles(e.target.files);
    setCreateFileError(error);
    setCreateForm((f) => ({ ...f, images: valid }));
    setCreatePreviews(valid.map((f) => URL.createObjectURL(f)));
  };

  const removeCreatePreview = (i: number) => {
    setCreateForm((f) => ({
      ...f,
      images: f.images.filter((_, idx) => idx !== i),
    }));
    setCreatePreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const submitCreate = async () => {
    const fd = new FormData();
    if (createForm.mrp) fd.append("mrp", createForm.mrp);
    if (createForm.discount) fd.append("discount", createForm.discount);
    fd.append("stock", createForm.stock);
    const attrObj: Record<string, string> = {};
    createForm.attributes.forEach(({ key, value }) => {
      if (key.trim()) attrObj[key.trim()] = value.trim();
    });
    fd.append("attributes", JSON.stringify(attrObj));
    createForm.images.forEach((img) => fd.append("images", img));
    await CreateVariantHandler(productId, fd as any);
     onRefresh();
    setShowCreate(false);
    setCreateForm({
      mrp: "",
      discount: "",
      stock: "",
      attributes: [{ key: "", value: "" }],
      images: [],
    });
    setCreatePreviews([]);
    setCreateFileError("");
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    mrp: "",
    discount: "",
    stock: "",
    attributes: [{ key: "", value: "" }],
    newImages: [] as File[],
    keepFileIds: [] as string[],
  });
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [editFileError, setEditFileError] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const openEdit = (variant: any) => {
    const attrs = getAttrsObj(variant);
    setEditingId(variant._id);
    setEditForm({
      mrp: String(variant.mrp ?? ""),
      discount: String(variant.discount ?? ""),
      stock: String(variant.stock ?? ""),
      attributes:
        Object.entries(attrs).length > 0
          ? Object.entries(attrs).map(([key, value]) => ({
            key,
            value: value as string,
          }))
          : [{ key: "", value: "" }],
      newImages: [],
      keepFileIds: (variant.images || [])
        .map((img: any) => img.fileId)
        .filter(Boolean),
    });
    setEditPreviews([]);
    setEditFileError("");
  };

  const handleEditImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const { valid, error } = validateFiles(e.target.files);
    setEditFileError(error);
    setEditForm((f) => ({ ...f, newImages: valid }));
    setEditPreviews(valid.map((f) => URL.createObjectURL(f)));
  };

  const removeEditPreview = (i: number) => {
    setEditForm((f) => ({
      ...f,
      newImages: f.newImages.filter((_, idx) => idx !== i),
    }));
    setEditPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const toggleKeep = (fileId: string) => {
    setEditForm((f) => ({
      ...f,
      keepFileIds: f.keepFileIds.includes(fileId)
        ? f.keepFileIds.filter((id) => id !== fileId)
        : [...f.keepFileIds, fileId],
    }));
  };

  const submitEdit = async (variantId: string) => {
    const attrObj: Record<string, string> = {};
    editForm.attributes.forEach(({ key, value }) => {
      if (key.trim()) attrObj[key.trim()] = value.trim();
    });
    await UpdateVariantHandler(variantId, {
      mrp: Number(editForm.mrp) as any,
      discount: Number(editForm.discount) as any,
      stock: Number(editForm.stock) as any,
      attributes: attrObj as any,
      images: [] as any,
      keep: editForm.keepFileIds,
    });
    const fd = new FormData();
    fd.append("keep", JSON.stringify(editForm.keepFileIds));
    editForm.newImages.forEach((img) => fd.append("images", img));
    await api.patch(`/api/variants/${variantId}`, fd);
    await onRefresh();
    setEditingId(null);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const submitDelete = async (variantId: string) => {
    await DeleteVariantHandler(variantId);
    await onRefresh();
    setDeletingId(null);
  };

  if (loading && variants.length === 0) {
    return (
      <div className="flex items-center gap-2 py-4 text-text-subtle">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="mate text-sm">Loading variants...</span>
      </div>
    );
  }

  if (!isAdmin && variants.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-5">
        <Package className="w-4 h-4 text-primary shrink-0" />
        <h3 className="mate font-semibold text-text text-base">
          {isAdmin ? "Manage Variants" : "Choose a Variant"}
        </h3>
        {isAdmin && (
          <span className="ml-auto text-xs bg-primary/10 text-primary-dark px-2.5 py-0.5 rounded-full teko tracking-wider border border-primary/20">
            ADMIN
          </span>
        )}
      </div>

      {!isAdmin && (
        <div className="space-y-5">
          {allKeys.map((key) => {
            const available = getAvailableValues(key, selectedAttrs);
            if (available.length === 0) return null;
            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="mate text-sm font-semibold text-text capitalize">
                    {key}
                  </span>
                  {selectedAttrs[key] && (
                    <span className="text-xs text-text-subtle bg-background-light px-2 py-0.5 rounded-full capitalize">
                      {selectedAttrs[key]}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {available.map((val) => {
                    const isActive = selectedAttrs[key] === val;

                    return (
                      <button
                        key={val}
                        onClick={() => handleSelectAttr(key, val)}
                        className={`px-4 py-2 rounded-radius-sm border-2 mate text-sm font-medium capitalize transition-all duration-200 ${isActive ? "border-primary bg-primary text-white shadow-soft" : "border-border/40 bg-background text-text hover:border-primary/50 hover:bg-background-light"}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <AnimatePresence>
            {selectedVariant && (
              <motion.div
                key="vi"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-2 p-4 rounded-radius-md h-32  bg-primary/5 border border-primary/20 flex flex-wrap items-center gap-5">
                  <div className="h-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={selectedVariant.images[0].url}
                      alt="variant image"
                    />
                  </div>
                  <div>
                    <p className="mate text-xs text-text-subtle mb-0.5">
                      Variant Price
                    </p>
                    <p className="teko text-3xl text-primary-dark font-medium leading-none">
                      Rs.{selectedVariant.finalPrice || selectedVariant.mrp}
                    </p>
                    {selectedVariant.mrp >
                      (selectedVariant.finalPrice || 0) && (
                        <div>
                          <p className="mate text-xs text-text-subtle mb-0.5">
                            MRP
                          </p>
                          <p className="teko text-xl text-text-subtle line-through leading-none">
                            Rs.{selectedVariant.mrp}
                          </p>
                        </div>
                      )}
                    {selectedVariant.discount > 0 && (
                      <div className="bg-success-light/20 text-success-dark px-2.5 py-1 rounded-full">
                        <p className="teko text-base leading-none">
                          Save {selectedVariant.discount}%
                        </p>
                      </div>
                    )}
                    <div className="ml-auto">
                      <p className="mate text-xs text-text-subtle mb-0.5">
                        Availability
                      </p>
                      <div
                        className={`flex items-center gap-1.5 mate text-sm font-medium ${selectedVariant.stock > 0 ? "text-success-dark" : "text-danger-dark"}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${selectedVariant.stock > 0 ? "bg-success animate-pulse" : "bg-danger"}`}
                        />
                        {selectedVariant.stock > 0
                          ? `${selectedVariant.stock} in stock`
                          : "Out of stock"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isAdmin && (
        <div className="space-y-4">
          <button
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-radius-sm teko text-xl tracking-wider shadow-soft hover:bg-primary-light active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Variant
            {showCreate ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>

          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="border border-border/40 rounded-radius-md p-5 bg-background-light/30 space-y-4">
                  <h4 className="teko text-2xl text-text tracking-wider">
                    New Variant
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        { label: "MRP (Rs.)", key: "mrp", ph: "0" },
                        { label: "Discount (%)", key: "discount", ph: "0" },
                        { label: "Stock", key: "stock", ph: "0" },
                      ] as const
                    ).map(({ label, key, ph }) => (
                      <div key={key}>
                        <label className="mate text-xs text-text-subtle block mb-1">
                          {label}
                        </label>
                        <input
                          type="number"
                          value={createForm[key]}
                          min="0"
                          max={key === "discount" ? "100" : undefined}
                          placeholder={ph}
                          onChange={(e) =>
                            setCreateForm((f) => ({
                              ...f,
                              [key]: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="mate text-xs text-text-subtle">
                        Attributes
                      </label>
                      <button
                        onClick={() =>
                          setCreateForm((f) => ({
                            ...f,
                            attributes: [
                              ...f.attributes,
                              { key: "", value: "" },
                            ],
                          }))
                        }
                        className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3" /> Add Row
                      </button>
                    </div>
                    <div className="space-y-2">
                      {createForm.attributes.map((attr, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={attr.key}
                            onChange={(e) =>
                              setCreateForm((f) => ({
                                ...f,
                                attributes: f.attributes.map((a, i) =>
                                  i === idx ? { ...a, key: e.target.value } : a,
                                ),
                              }))
                            }
                            placeholder="Key (e.g. color)"
                            className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) =>
                              setCreateForm((f) => ({
                                ...f,
                                attributes: f.attributes.map((a, i) =>
                                  i === idx
                                    ? { ...a, value: e.target.value }
                                    : a,
                                ),
                              }))
                            }
                            placeholder="Value (e.g. blue)"
                            className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
                          />
                          {createForm.attributes.length > 1 && (
                            <button
                              onClick={() =>
                                setCreateForm((f) => ({
                                  ...f,
                                  attributes: f.attributes.filter(
                                    (_, i) => i !== idx,
                                  ),
                                }))
                              }
                              className="p-1.5 text-danger hover:text-danger-dark rounded hover:bg-danger/10 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mate text-xs text-text-subtle block mb-2">
                      Images{" "}
                      <span className="text-text-subtle/60">
                        (max {MAX_FILES}, 5 MB each)
                      </span>
                    </label>
                    <div
                      onClick={() => createInputRef.current?.click()}
                      className="border-2 border-dashed border-border/40 rounded-radius-sm p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition group"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition">
                        <Plus className="w-4 h-4 text-primary" />
                      </div>
                      <p className="mate text-sm text-text-subtle">
                        Click to upload images
                      </p>
                      <p className="mate text-xs text-text-subtle/60 mt-1">
                        PNG, JPG, WEBP - max 5 MB each
                      </p>
                    </div>
                    <input
                      ref={createInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleCreateImages}
                    />
                    {createFileError && (
                      <p className="mate text-xs text-danger mt-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {createFileError}
                      </p>
                    )}
                    {createPreviews.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {createPreviews.map((src, i) => (
                          <div
                            key={i}
                            className="relative w-16 h-16 rounded-radius-sm overflow-hidden border border-border/30 group/img"
                          >
                            <img
                              src={src}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeCreatePreview(i)}
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={submitCreate}
                      disabled={loading}
                      className="flex-1 bg-primary text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Create Variant
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="px-5 border border-border/50 text-text-subtle rounded-radius-sm hover:bg-background-light active:scale-95 transition-all mate text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {variants.length === 0 && !showCreate && (
            <div className="text-center py-10 border border-dashed border-border/30 rounded-radius-md">
              <Package className="w-10 h-10 text-text-subtle/30 mx-auto mb-3" />
              <p className="mate text-sm text-text-subtle">No variants yet.</p>
              <p className="mate text-xs text-text-subtle/60 mt-1">
                Create a variant above to get started.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {variants.map((variant) => {
              const attrs = getAttrsObj(variant);
              const isEditing = editingId === variant._id;
              return (
                <motion.div
                  key={variant._id}
                  layout
                  className="border border-border/30 rounded-radius-md overflow-hidden bg-background"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <div className="p-4 flex items-start gap-3">
                    {variant.images?.[0]?.url ? (
                      <img
                        src={variant.images[0].url}
                        alt="variant"
                        className="w-14 h-14 rounded-radius-sm object-cover border border-border/20 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-radius-sm bg-background-light flex items-center justify-center shrink-0 border border-border/20">
                        <Package className="w-5 h-5 text-text-subtle/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {Object.entries(attrs).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full border border-primary/15 teko tracking-wider"
                          >
                            <span className="capitalize">{k}:</span>

                            <span className="capitalize">{v}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs mate text-text-subtle">
                        <span>
                          MRP:{" "}
                          <span className="text-text font-medium">
                            Rs.{variant.mrp}
                          </span>
                        </span>
                        <span>
                          Price:{" "}
                          <span className="text-primary-dark font-medium">
                            Rs.{variant.finalPrice || variant.mrp}
                          </span>
                        </span>
                        {variant.discount > 0 && (
                          <span>
                            Discount:{" "}
                            <span className="text-text font-medium">
                              {variant.discount}%
                            </span>
                          </span>
                        )}
                        <span>
                          Stock:{" "}
                          <span
                            className={`font-medium ${variant.stock > 0 ? "text-success-dark" : "text-danger-dark"}`}
                          >
                            {variant.stock}
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-text-subtle/50 mt-1 truncate">
                        SKU: {variant.sku}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() =>
                          isEditing ? setEditingId(null) : openEdit(variant)
                        }
                        className={`p-2 rounded-radius-sm border transition-all active:scale-90 ${isEditing ? "bg-primary text-white border-primary" : "border-border/40 text-text-subtle hover:text-primary hover:border-primary/40 hover:bg-primary/5"}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(variant._id)}
                        className="p-2 rounded-radius-sm border border-border/40 text-text-subtle hover:text-danger hover:border-danger/40 hover:bg-danger/5 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border/20 p-4 bg-background-light/20 space-y-4">
                          <h5 className="teko text-xl text-text tracking-wider">
                            Edit Variant
                          </h5>
                          <div className="grid grid-cols-3 gap-3">
                            {(
                              [
                                { label: "MRP (Rs.)", key: "mrp" },
                                { label: "Discount (%)", key: "discount" },
                                { label: "Stock", key: "stock" },
                              ] as const
                            ).map(({ label, key }) => (
                              <div key={key}>
                                <label className="mate text-xs text-text-subtle block mb-1">
                                  {label}
                                </label>
                                <input
                                  type="number"
                                  value={editForm[key]}
                                  min="0"
                                  max={key === "discount" ? "100" : undefined}
                                  onChange={(e) =>
                                    setEditForm((f) => ({
                                      ...f,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
                                />
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="mate text-xs text-text-subtle">
                                Attributes
                              </label>
                              <button
                                onClick={() =>
                                  setEditForm((f) => ({
                                    ...f,
                                    attributes: [
                                      ...f.attributes,
                                      { key: "", value: "" },
                                    ],
                                  }))
                                }
                                className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition"
                              >
                                <Plus className="w-3 h-3" /> Add Row
                              </button>
                            </div>
                            <div className="space-y-2">
                              {editForm.attributes.map((attr, idx) => (
                                <div
                                  key={idx}
                                  className="flex gap-2 items-center"
                                >
                                  <input
                                    type="text"
                                    value={attr.key}
                                    placeholder="Key"
                                    onChange={(e) =>
                                      setEditForm((f) => ({
                                        ...f,
                                        attributes: f.attributes.map((a, i) =>
                                          i === idx
                                            ? { ...a, key: e.target.value }
                                            : a,
                                        ),
                                      }))
                                    }
                                    className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
                                  />
                                  <input
                                    type="text"
                                    value={attr.value}
                                    placeholder="Value"
                                    onChange={(e) =>
                                      setEditForm((f) => ({
                                        ...f,
                                        attributes: f.attributes.map((a, i) =>
                                          i === idx
                                            ? { ...a, value: e.target.value }
                                            : a,
                                        ),
                                      }))
                                    }
                                    className="flex-1 px-3 py-2 rounded-radius-sm border border-border/50 bg-background text-text mate text-sm focus:outline-none focus:border-primary transition"
                                  />
                                  {editForm.attributes.length > 1 && (
                                    <button
                                      onClick={() =>
                                        setEditForm((f) => ({
                                          ...f,
                                          attributes: f.attributes.filter(
                                            (_, i) => i !== idx,
                                          ),
                                        }))
                                      }
                                      className="p-1.5 text-danger hover:text-danger-dark rounded hover:bg-danger/10 transition"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            {variant.images?.length > 0 && (
                              <div className="mb-3">
                                <label className="mate text-xs text-text-subtle block mb-2">
                                  Current Images{" "}
                                  <span className="text-text-subtle/60">
                                    (click to keep/remove)
                                  </span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                  {variant.images.map((img: any) => {
                                    const kept = editForm.keepFileIds.includes(
                                      img.fileId,
                                    );
                                    return (
                                      <div
                                        key={img.fileId}
                                        onClick={() => toggleKeep(img.fileId)}
                                        className={`relative w-16 h-16 rounded-radius-sm overflow-hidden border-2 cursor-pointer transition-all ${kept ? "border-primary opacity-100" : "border-transparent opacity-40"}`}
                                      >
                                        <img
                                          src={img.url}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                        {!kept && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <X className="w-5 h-5 text-white drop-shadow" />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            <label className="mate text-xs text-text-subtle block mb-2">
                              Add New Images{" "}
                              <span className="text-text-subtle/60">
                                (max 5 MB each)
                              </span>
                            </label>
                            <div
                              onClick={() => editInputRef.current?.click()}
                              className="border-2 border-dashed border-border/40 rounded-radius-sm p-3 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
                            >
                              <p className="mate text-xs text-text-subtle">
                                + Upload new images
                              </p>
                            </div>
                            <input
                              ref={editInputRef}
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleEditImages}
                            />
                            {editFileError && (
                              <p className="mate text-xs text-danger mt-1.5 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {editFileError}
                              </p>
                            )}
                            {editPreviews.length > 0 && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {editPreviews.map((src, i) => (
                                  <div
                                    key={i}
                                    className="relative w-16 h-16 rounded-radius-sm overflow-hidden border border-border/30 group/img"
                                  >
                                    <img
                                      src={src}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      onClick={() => removeEditPreview(i)}
                                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition"
                                    >
                                      <X className="w-4 h-4 text-white" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => submitEdit(variant._id)}
                              disabled={loading}
                              className="flex-1 bg-gold-dark text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-5 border border-border/50 text-text-subtle rounded-radius-sm hover:bg-background-light transition-all mate text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-background rounded-radius-lg p-6 max-w-sm w-full shadow-large"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-danger/10 rounded-full">
                  <Trash2 className="w-5 h-5 text-danger" />
                </div>
                <h3 className="teko text-2xl text-text tracking-wider">
                  Delete Variant?
                </h3>
              </div>
              <p className="mate text-sm text-text-subtle mb-6 leading-relaxed">
                This action is permanent. The variant and all its images will be
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => submitDelete(deletingId)}
                  disabled={loading}
                  className="flex-1 bg-danger text-white teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-danger-dark active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 border border-border/50 text-text-subtle teko text-xl tracking-wider py-2.5 rounded-radius-sm hover:bg-background-light transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VariantSection;
