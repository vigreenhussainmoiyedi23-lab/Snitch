import productModel from "../models/product.model.js";
import brandModel from "../models/productSubModels/brands.model.js";
import categoryModel from "../models/productSubModels/category.model.js";
import counterModel from "../models/productSubModels/counter.model.js";
import subCategoryModel from "../models/productSubModels/subCategory.model.js";
import { uploadImage } from "../services/product.service.js";
import asyncHandler from "../utils/AsyncHandler.js";
import slugify from "slugify";
export const  CreateProductHandler = asyncHandler(async (req, res) => {
  const files = req.files as Express.Multer.File[];
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
  } = req.body;

  if (!files || files.length === 0)
    return res.status(400).json({ message: "No image uploaded" });
  const responses = await Promise.all(
    files.map((file) =>
      uploadImage({
        buffer: file.buffer,
        fileName: file.originalname,
        folder: "products",
      }),
    ),
  );
  let [validBrand, validCategory, validSubCategory, sequence] =
    await Promise.all([
      brandModel.findOne({ name: brand }),
      categoryModel.findOne({ name: category }),
      subCategoryModel.findOne({ name: subCategory }),
      counterModel.findOne({ name: "product" }),
    ]);
  if (!validBrand) validBrand = await brandModel.create({ name: brand });
  if (!validCategory)
    validCategory = await categoryModel.create({ name: category });
  if (!validSubCategory)
    validSubCategory = await subCategoryModel.create({ name: subCategory });
  if (!sequence) {
    sequence = await counterModel.create({
      name: "product",
      sequence_value: 1,
    });
  }
  let slug = slugify(title + " " + (Date.now() + ``).slice(-5), {
    lower: true,
    strict: true,
  });
  const product = await productModel.create({
    title,
    slug,
    description,
    shortDescription,
    category: validCategory._id,
    subCategory: validSubCategory._id,
    brand: validBrand._id,
    mrp: price,
    stock,
    sku: `SKU-${(sequence.sequence_value!++).toString().padStart(6, "0")}`,
    barcode,
    tags,
    status,
    visibility,
    isFeatured,
    discount: discount || 0,
    images: responses,
  });
  await sequence.save();
  res.status(201).json({ product, message: "Product created successfully" });
});
