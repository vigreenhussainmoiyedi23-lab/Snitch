import { buffer } from "node:stream/consumers";
import { imagekit } from "../config/imagekit.js";
import { toFile } from "@imagekit/nodejs";
import AppError from "../utils/AppError.js";
import brandModel from "../models/productSubModels/brands.model.js";
import categoryModel from "../models/productSubModels/category.model.js";
import subCategoryModel from "../models/productSubModels/subCategory.model.js";
import counterModel from "../models/productSubModels/counter.model.js";

export const uploadImage = async (data: {
  buffer: Buffer;
  fileName: string;
  folder: string;
}) => {
  const res = await imagekit.files.upload({
    file: await toFile(Buffer.from(data.buffer), "file"),
    fileName: data.fileName,
    folder: data.folder,
  });

  return res;
};
export const isAdmin = (user: any) => {
  if (user.role !== "admin")
    throw new AppError("You are not authorized to perform this action", 401);
};
export const validSequenceBrandSubCatAndCategory = async (data: {
  category: string;
  subCategory: string;
  brand: string;
}) => {
  let [validBrand, validCategory, validSubCategory, sequence] =
    await Promise.all([
      brandModel.findOne({ name: data.brand }),
      categoryModel.findOne({ name: data.category }),
      subCategoryModel.findOne({ name: data.subCategory }),
      counterModel.findOne({ name: "product" }),
    ]);
  if (!validBrand) validBrand = await brandModel.create({ name: data.brand });
  if (!validCategory)
    validCategory = await categoryModel.create({ name: data.category });
  if (!validSubCategory)
    validSubCategory = await subCategoryModel.create({ name: data.subCategory });
  if (!sequence || !sequence.sequence_value) {
    sequence = await counterModel.create({
      name: "product",
      sequence_value: 1,
    });
  }

  return [validBrand, validCategory, validSubCategory, sequence];
};
