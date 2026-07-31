import { Router } from "express";
import upload from "../config/multer.js";
import {
  CreateProductHandler,
  DeleteProductHandler,
  GetProductHandler,
  GetProductThroughSlugHandler,
  UpdateProductsPatchHandler,
  UpdateProductsPutHandler,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  getProductsValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";

const productRouter = Router();
/**
 * @get /api/products/
 * @query {page,limit,cat,brand,search,Uprice,Lprice}
 * @description get all products
 * @return { products,page,limit,total,totalPages}
 */
productRouter.get("/", getProductsValidator, GetProductHandler);
/**
 * @get /api/products/:slug
 * @query {slug}
 * @description get product through slug
 * @return {success,message}
 */
productRouter.get("/:slug", getProductsValidator, GetProductThroughSlugHandler);
/**
 * @post /api/products/
 * @body {title,description,shortDescription,category,subCategory,brand,mrp,stock,barcode,tags,status,visibility,isFeatured,discount,images}
 * @description create a product
 * @return {success,message}
 */
productRouter.post(
  "/",
  isUserVerified,
  upload.array("images", 5),
  createProductValidator,
  CreateProductHandler,
);
/**
 * @put /api/products
 * @body {title,description,shortDescription,category,subCategory,brand,mrp,stock,barcode,tags,status,visibility,isFeatured,discount,images}
 */
productRouter.put(
  "/:id",
  isUserVerified,
  updateProductValidator,
  UpdateProductsPutHandler,
);
/**
 * @patch /api/products
 * @body {keep:[includes fileIds to keep]}
 * @files {images}:new images
 */
productRouter.patch(
  "/:id",
  upload.array("images", 5),
  isUserVerified,
  UpdateProductsPatchHandler,
);

/**
 * @delete /api/products/:id
 * @description delete a product
 * @return {success,message}
 */
productRouter.delete("/:id", isUserVerified, DeleteProductHandler);

export default productRouter;
