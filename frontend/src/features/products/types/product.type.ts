export type product = {
  _id: string;
  slug: string;
  title: string;
  tags: string[];
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: [{
    fileId: string;
    url: string;
    thumbnailUrl: string;
  }];
  shortDescription: string;
  description: string;
  currency: string;
  finalPrice: number;
  discount: number;
  mrp: number;
  createdAt: string;
  updatedAt: string;
};
