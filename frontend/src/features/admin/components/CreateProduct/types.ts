// Shared type definitions for the CreateProduct feature

export type AttributeItem = {
  key: string;
  value: string;
};

export type ProductFormValues = {
  // ── Basic Information ──────────────────────────────────
  title: string;
  shortDescription: string;
  description: string;

  // ── Pricing ────────────────────────────────────────────
  price: number | string;
  discount: number | string;
  currency: string;

  // ── Inventory ──────────────────────────────────────────
  barcode: string;
  stock: number | string;
  lowStockThreshold: number | string;

  // ── Classification ─────────────────────────────────────
  brand: string;
  category: string;
  subCategory: string;
  tags: string;
  attributes: AttributeItem[];

  // ── Shipping ───────────────────────────────────────────
  weight: string;
  length: string;
  width: string;
  height: string;

  // ── SEO ────────────────────────────────────────────────
  metaTitle: string;
  metaDescription: string;
  keywords: string;

  // ── Publishing ─────────────────────────────────────────
  status: string;
  visibility: string;
  isFeatured: boolean;
};
