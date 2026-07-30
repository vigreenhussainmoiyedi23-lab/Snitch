import productModel from "../models/product.model.js";
import brandModel from "../models/productSubModels/brands.model.js";
import categoryModel from "../models/productSubModels/category.model.js";
import counterModel from "../models/productSubModels/counter.model.js";
import subCategoryModel from "../models/productSubModels/subCategory.model.js";
import {
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

export const GetProductHandler = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const query: any = {};

  if (req.query.cat) {
    query.category = req.query.cat;
  }

  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { shortDescription: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }
  query.finalPrice = {
    $gte: req.query.Uprice || 0,
    $lte: req.query.Lprice || Number.MAX_SAFE_INTEGER,
  };

  const products = await productModel
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await productModel.countDocuments(query);

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
  const products = await productModel.findOne({ slug: req.params.slug }).lean();
  res.status(200).json({
    products,
  });
});

export const DeleteProductHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  isAdmin(user);
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);
  res.status(200).json({ message: "Product deleted successfully" });
});

export const UpdateProductsPutHandler = asyncHandler(async (req, res) => {
  const user = req.user;
  isAdmin(user);
  const { id } = req.params;
  if(!req.body) throw new AppError("Body is required", 400);
  if(req.body.images)throw new AppError("Images cannot be updated through this endpoint", 400);
  if(req.body.slug)throw new AppError("Slug cannot be updated through this endpoint", 400);
  if(req.body.SKU)throw new AppError("SKU cannot be updated through this endpoint", 400);
  
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
  const keep = JSON.parse(req.body.keep) || [];
  if (!Array.isArray(keep)) throw new AppError("Keep is required", 400);

  const product = await productModel.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  product.images = product.images.filter((image) =>
    keep.includes(image._id.toString()),
  ) as any;
  if (newFilesResponses) {
    product.images.push(...newFilesResponses);
  }
  await product.save();
  res.status(200).json({
    product,
    message: "Product updated successfully",
  });
});
