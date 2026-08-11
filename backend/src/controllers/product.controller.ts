import productModel from "../models/product.model.js";
import brandModel from "../models/productSubModels/brands.model.js";
import categoryModel from "../models/productSubModels/category.model.js";
import { type SortOrder } from "mongoose";
import subCategoryModel from "../models/productSubModels/subCategory.model.js";
import {
  deleteImageFromFileId,
  isAdmin,
  uploadImage,
  validSequenceBrandSubCatAndCategory,
} from "../services/product.service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";
export const CreateProductHandler = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const user = req.user;
  isAdmin(user);
  const {
    title,
    description,
    shortDescription,
    category,
    subCategory,
    brand,
    price,
    stock,
    barcode,
    tags,
    status,
    visibility,
    isFeatured,
    discount,
    attributes,
  } = req.body;

  if (!files || files.length === 0)
    throw new AppError("No files uploaded", 400);
  const responses = await Promise.all(
    files.map((file) =>
      uploadImage({
        buffer: file.buffer,
        fileName: file.originalname,
        folder: "products",
      }),
    ),
  );

  let [validBrand, validCategory, validSubCategory, sequence]: any =
    await validSequenceBrandSubCatAndCategory({ category, subCategory, brand });

  const sku = `SKU-${(sequence!.sequence_value!++).toString().padStart(6, "0")}`;

  const product = await productModel.create({
    title,
    description,
    shortDescription,
    category: validCategory?.name || "other",
    subCategory: validSubCategory?.name || "other",
    brand: validBrand?.name || "other",
    mrp: price,
    stock,
    sku,
    barcode,
    tags: tags.split(",") || [],
    status,
    visibility,
    isFeatured,
    discount: discount || 0,
    images: responses,
    attributes: JSON.parse(attributes || `{}`),
  });
  res.status(201).json({ product, message: "Product created successfully" });
  await sequence!.save();
});
export const GetAllEnumsHandler = asyncHandler(async (req, res) => {
  const [categories, subCategories, brands] = await Promise.all([
    categoryModel.find().select("name -_id").lean(),
    subCategoryModel
      .find()
      .populate({ path: "category", select: "name -_id" })
      .lean(),
    brandModel.find().select("name -_id").lean(),
  ]);

  res.status(200).json({
    categories: categories.map((c) => c.name),
    subCategories: subCategories.map((s:any) => ({
      name: s.name,
      category: s.category!.name,
    })),
    brands: brands.map((b) => b.name),
  });
});
export const GetProductHandler = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const query: any = {};
  const sort: Record<string, SortOrder> = {
    createdAt: -1,
  };

  switch (req.query.sort) {
    case "oldest":
      sort.createdAt = 1;
      break;

    case "price:asc":
      delete sort.createdAt;
      sort.finalPrice = 1;
      break;

    case "price:dsc":
      delete sort.createdAt;
      sort.finalPrice = -1;
      break;
  }
  if (req.query.cat) {
    query.category = req.query.cat;
  }

  if (req.query.brand) {
    query.brand = req.query.brand;
  }
  if (req.query.subCategory) {
    query.subCategory = req.query.subCategory;
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { shortDescription: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }
  query.finalPrice = {
    $lte: Number(req.query.Uprice) || Number.MAX_SAFE_INTEGER,
    $gte: Number(req.query.Lprice) || 0,
  };

  const [products, total] = await Promise.all([
    productModel
      .find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    productModel.countDocuments(query),
  ]);

  res.status(200).json({
    products,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

export const GetProductThroughSlugHandler = asyncHandler(async (req, res) => {
  if (!req.params.slug) throw new AppError("Slug is required", 400);
  const product = await productModel.findOne({ slug: req.params.slug }).populate("variants").lean();
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({
    product,
    message: " Product found successfully",
    success: true,
  });
});

export const DeleteProductHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  isAdmin(user);
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({ message: "Product deleted successfully" });
  product.images.map((image) => deleteImageFromFileId(image.fileId!));
});

export const UpdateProductsPutHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  isAdmin(user);
  const { id } = req.params;
  let validBrand, validCategory, validSubCategory;

  if (req.body.brand || req.body.category || req.body.subCategory) {
    [validBrand, validCategory, validSubCategory] =
      await validSequenceBrandSubCatAndCategory(req.body);
    if (req.body.category) req.body.category = validCategory?.name || "other";
    if (req.body.brand) {
      req.body.brand = validBrand?.name || "other";
    }
    if (req.body.subCategory) {
      req.body.subCategory = validSubCategory?.name || "other";
    }
  }
  if (req.body.mrp || req.body.discount) {
    const { mrp, discount } = req.body;
    req.body.finalPrice = mrp * (1 - discount / 100);
  }
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({
    product,
    message: "Product updated successfully",
  });
});

export const UpdateProductsPatchHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const keep = req.body.keep || [];

  if (!keep) throw new AppError("Keep is required", 400);
  let newFilesResponses;
  if (files) {
    newFilesResponses = await Promise.all(
      files.map((file) =>
        uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
          folder: "products",
        }),
      ),
    );
  }

  const product = await productModel.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  product!.images = product!.images.filter((image) => {
    console.log(
      image.fileId!.toString(),
      keep.includes(image.fileId!.toString()),
    );
    return keep.includes(image.fileId!.toString());
  }) as any;
  if (newFilesResponses) {
    product!.images.push(...newFilesResponses);
  }
  if (product.images.length === 0)
    throw new AppError("At least one image is required", 400);
  await product.save();
  res.status(200).json({
    product,
    message: "Product updated successfully",
  });
});
