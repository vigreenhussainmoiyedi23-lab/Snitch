import { Router } from "express";
import { isUserVerified } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";
import { createProductValidator } from "../validators/product.validator.js";
import { createVariantHandler, deleteVariantHandler, updatePutVariantHandler, updateVariantHandler } from "../controllers/variant.controller.js";

const variantRouter = Router();
// Product's variants routes
variantRouter.post(
  "/:slug",
  isUserVerified,
  upload.array("images", 5),
  createProductValidator,
  createVariantHandler,
);
variantRouter.delete("/:id", isUserVerified, deleteVariantHandler);
variantRouter.put("/:id", isUserVerified, updatePutVariantHandler);
variantRouter.patch("/:id", isUserVerified, updateVariantHandler);

export default variantRouter;