import {
  deleteImageFromFileId,
  isAdmin,
  isValidProductId,
  uploadImage,
} from "../services/product.service.js";
import asyncHandler from "../utils/AsyncHandler.js";
import variantModel from "../models/productSubModels/variant.model.js";
import AppError from "../utils/AppError.js";

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
  }else{
  }
  const sku =
    product.sku +
    "-" +
    Object.values(attributes)
      ?.map((val) => val?.toString()?.toLowerCase())
      .join("-");
  let finalPrice: number = mrp - (mrp * discount) / 100;
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
    productId:productId!?.toString()
  });
  product.variants.push(variant._id);
  await product.save();
  return res.status(201).json({
    success: true,
    message: "Variant created successfully",
    variant,
  });
});

export const getProductsVariantHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await isValidProductId(productId?.toString());
  const variants = await variantModel.find({ _id: { $in: product.variants } });
  return res.status(200).json({
    success: true,
    message: "Products variant fetched successfully",
    variants,
  });
});

export const updateVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
  const { variantId } = req.params;
  const files = req.files as Express.Multer.File[];
  const keep = JSON.parse(req.body.keep || `[]`);
  const images: any = [];
  if (!keep && keep.length + files.length === 0)
    throw new AppError("Minimum one image is required", 400);
  const variant = await variantModel.findById(variantId);
  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }
  if (files) {
    const responses = await Promise.all(
      files.map((f) =>
        uploadImage({
          buffer: f.buffer,
          fileName: f.originalname + Date.now().toLocaleString(),
          folder: "products",
        }),
      ),
    );
    responses.map((res) => images.push(res));
  }
  if (keep) {
    variant?.images.map((img: any) => {
      if (keep.includes(img.fileId)) images.push(img);
    });
  }
  variant?.images.splice(0, variant.images.length, ...images);
  await variant?.save();

  return res.status(200).json({
    success: true,
    message: "Variant updated successfully",
    variant,
  });
});

export const deleteVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
  const { variantId } = req.params;
  const variant = await variantModel.findByIdAndDelete(variantId);
  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }
  if (variant.images.length > 0) {
    await Promise.all(
      variant.images.map((img: any) => deleteImageFromFileId(img.fileId)),
    );
  }
  return res.status(200).json({
    success: true,
    message: "Variant deleted successfully",
    variant,
  });
});

export const updatePutVariantHandler = asyncHandler(async (req, res) => {
  isAdmin(req.user);
  const { variantId } = req.params;
  const { mrp, discount, stock, attributes } = req.body;
  let tobeUpdated: any = {};
  if (mrp) tobeUpdated["mrp"] = mrp;
  if (discount) tobeUpdated["discount"] = discount;
  if (stock) tobeUpdated["stock"] = stock;
  if (attributes) tobeUpdated["attributes"] = attributes;
  if (Object.keys(tobeUpdated).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No field to update",
    });
  }
  const variant = await variantModel.findByIdAndUpdate(variantId, tobeUpdated, {
    new: true,
  });
  if (!variant) {
    return res.status(404).json({
      success: false,
      message: "Variant not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Variant Updated successfully",
    variant,
  });
});
