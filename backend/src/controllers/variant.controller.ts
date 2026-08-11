import {
  isAdmin,
  isValidProductId,
  uploadImage,
} from "../services/product.service.js";
import asyncHandler from "../utils/AsyncHandler.js";
import variantModel from "../models/productSubModels/variant.model.js";

export const createVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
  const { productId } = req.params;
  const product = await isValidProductId(productId?.toString());
  const { mrp, discount, stock } = req.body;
  const attributes = JSON.parse(req.body.attributes);
  const images: any = [];
  const files = req.files as Express.Multer.File[];
  // upload files to ImageKit and get the urls
  if (files && files.length > 0) {
    const responses = await Promise.all(
      files.map((file) =>
        uploadImage({
          buffer: file.buffer,
          fileName: file.originalname + Date.now().toLocaleString(),
          folder: "products",
        }),
      ),
    );
    responses.map((image) => images.push(image));
  }
  const sku =
    product.sku +
    "-" +
    Object.values(attributes)[0]!.toString().replaceAll(" ", "-");
  let finalPrice:number = mrp - (mrp * discount) / 100;
  if (isNaN(finalPrice)) finalPrice = product.finalPrice!;
  const isVariantExists = await variantModel.findOne({ sku });
  if (isVariantExists) {
    return res.status(400).json({
      success: false,
      message: "Variant already exists",
    });
  }
  const variant = await variantModel.create({
    mrp: mrp || product.mrp,
    discount: discount,
    stock,
    attributes: attributes,
    images: images || [],
    sku,
  });
  product.variants.push(variant._id);
  await product.save();
  return res.status(201).json({
    success: true,
    message: "Variant created successfully",
    variant,
  });
});

export const getProductsVariantHandler = asyncHandler(async (req, res) => {});

export const updateVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
});

export const deleteVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
});

export const updatePutVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
});
