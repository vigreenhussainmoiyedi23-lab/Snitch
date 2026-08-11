export type createVariant = {
  images: [];
  attributes: { [key: string]: string };
  mrp?: number;
  discount?: number;
  stock: number;
};
export type updateVariant = {
  images: [];
  attributes: { [key: string]: string };
  mrp?: number;
  discount?: number;
  stock: number;
  keep: string[];
};
