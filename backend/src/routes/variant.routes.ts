import { Router } from "express";
import { isUserVerified } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";
import { createVariantHandler, deleteVariantHandler, getProductsVariantHandler, updatePutVariantHandler, updateVariantHandler } from "../controllers/variant.controller.js";
import { createVariantValidator } from "../validators/variant.vallidator.js";
import { handleMulterError } from "../middlewares/error.middleware.js";

const variantRouter = Router();
/**
 * @post /api/variants/:productId
 * @body {mrp,discount,stock,attributes,images}
 * @files images []
 * @description create a variant
 * @return {success,message,variant}
 */
variantRouter.post(
  "/:productId",
  isUserVerified,
  upload.array("images", 5),
  createVariantValidator,
  createVariantHandler,
);
/**
 * @get /api/variants/:productId
 * @description get variants of a product
 * @return {success,message,variants}
 */
variantRouter.get("/:productId", getProductsVariantHandler);
/**
 * @delete /api/variants/:variantId
 * @description delete a variant
 * @return {success,message,variant}
 */
variantRouter.delete("/:variantId", isUserVerified, deleteVariantHandler);
/**
 * @put /api/variants/:variantId
 * @body {mrp,discount,stock,attributes}
 * @description update a variant
 * @return {success,message,variant}
 */
variantRouter.put("/:variantId", isUserVerified, updatePutVariantHandler);
/**
 * @patch /api/variants/:variantId
 * @body {keep:[includes fileIds to keep]}
 * @files images:[]
 * @description update a variant
 * @return {success,message,variant}
 */
variantRouter.patch("/:variantId",
  handleMulterError(upload.array("images", 5)),
  isUserVerified,
  updateVariantHandler);

export default variantRouter;