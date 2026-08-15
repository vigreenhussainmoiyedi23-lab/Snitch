import React, { useState } from "react";
import { Package, Loader2 } from "lucide-react";
import { useVariant } from "../hooks/useVariant";
import { useAppSelector } from "../../../app/redux/hook";
import api from "../../../app/axios";
import CreateVariantForm from "./CreateSubComponents/CreateVariantForm";
import VariantCard from "./CreateSubComponents/VariantCard";
import EditVariantForm from "./CreateSubComponents/EditVariantForm";
import DeleteConfirmDialog from "./CreateSubComponents/DeleteConfirmDialog";

interface VariantSectionProps {
  productId: string;
  isAdmin: boolean;
  onRefresh: () => void;
}

const getAttrsObj = (v: any): Record<string, string> => {
  if (!v?.attributes) return {};
  if (v.attributes instanceof Map) return Object.fromEntries(v.attributes);
  if (typeof v.attributes === "object")
    return v.attributes as Record<string, string>;
  return {};
};

const CreateVariantSection: React.FC<VariantSectionProps> = ({
  productId,
  isAdmin,
  onRefresh,
}) => {
  const { CreateVariantHandler, UpdateVariantHandler, DeleteVariantHandler } =
    useVariant();
  const variants = useAppSelector((s) => s.variant.variants);
  const loading = useAppSelector((s) => s.variant.loading);
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
    onRefresh();
    setEditingId(null);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const submitDelete = async (variantId: string) => {
    await DeleteVariantHandler(variantId);
    onRefresh();
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

  if (!isAdmin) return null;

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

      <div className="space-y-4">
        <CreateVariantForm
          show={showCreate}
          onToggle={() => setShowCreate((v) => !v)}
          form={createForm}
          previews={createPreviews}
          fileError={createFileError}
          loading={loading}
          onFormChange={setCreateForm}
          onImagesChange={(files) => {
            setCreateForm((f) => ({ ...f, images: files }));
          }}
          onFileErrorChange={setCreateFileError}
          onPreviewsChange={setCreatePreviews}
          onSubmit={submitCreate}
        />

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
            const isEditing = editingId === variant._id;
            return (
              <div key={variant._id}>
                <VariantCard
                  variant={variant}
                  isEditing={isEditing}
                  onEdit={() =>
                    isEditing ? setEditingId(null) : openEdit(variant)
                  }
                  onDelete={() => setDeletingId(variant._id)}
                  getAttrsObj={getAttrsObj}
                />
                {isEditing && (
                  <EditVariantForm
                    variant={variant}
                    form={editForm}
                    previews={editPreviews}
                    fileError={editFileError}
                    loading={loading}
                    onFormChange={setEditForm}
                    onImagesChange={(files) => {
                      setEditForm((f) => ({ ...f, newImages: files }));
                    }}
                    onFileErrorChange={setEditFileError}
                    onPreviewsChange={setEditPreviews}
                    onToggleKeep={toggleKeep}
                    onCancel={() => setEditingId(null)}
                    onSubmit={() => submitEdit(variant._id)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DeleteConfirmDialog
        show={!!deletingId}
        loading={loading}
        onConfirm={() => deletingId && submitDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};

export default CreateVariantSection;
