import { Router } from "express";
import upload from "../config/multer.js";
import {
  CreateProductHandler,
  GetProductHandler,
  GetProductThroughSlugHandler,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  getProductsValidator,
} from "../validators/product.validator.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";

const productRouter = Router();
/**
 * @get /api/products/
 * @query {page,limit,cat,brand,search,Uprice,Lprice}
 * @description get all products
 * @return {success,message}
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
productRouter.put("/", (req, res) => {});
/**
 * @patch /api/products
 * @body {keep:[includes fileIds]}
 * @files {images}:new images
 */
productRouter.patch("/", upload.array("images", 5), (req, res) => {});
/**
 *
 */
productRouter.delete("/", (req, res) => {});

export default productRouter;
