export type Images = {
    fileId: string;
    url: string;
    thumbnailUrl: string;
};

export type Variant = {
    sku: string;
    mrp: number;
    discount: number;
    finalPrice: number;
    stock: number;
    barcode: string;
    attributes: { [key: string]: string };
    images: Images[];
};