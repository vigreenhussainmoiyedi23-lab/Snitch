import { Router } from "express";
import upload from "../config/multer.js";
import {
  CreateProductHandler,
  DeleteProductHandler,
  GetAllEnumsHandler,
  GetProductHandler,
  GetProductThroughSlugHandler,
  UpdateProductsOptionsHandler,
  UpdateProductsPatchHandler,
  UpdateProductsPutHandler,
} from "../controllers/product.controller.js";
import {
  createProductValidator,
  getProductsValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import { isUserAdmin, isUserVerified } from "../middlewares/auth.middleware.js";

const productRouter = Router();

/**
 * @post /api/products/
 * @body {title,description,shortDescription,category,subCategory,brand,mrp,stock,barcode,tags,status,visibility,isFeatured,discount,images}
 * @description create a product
 * @return {success,message,product}
 */
productRouter.post(
  "/",
  isUserVerified,
  isUserAdmin,
  upload.any(),
  createProductValidator,
  CreateProductHandler,
);
/**
 * @get /api/products/
 * @query {page,limit,cat,brand,search,Uprice,Lprice,subCategory,sort}
 * @description get all products
 * @return { products,page,limit,total,totalPages}
 */
productRouter.get("/", getProductsValidator, GetProductHandler);
/**
 * @get /api/products/all/enums
 * @description get all Enums (categories , subCategories , brands)
 * @return { categories,subCategories,brands}
 */
productRouter.get("/all/enums", GetAllEnumsHandler);
/**
 * @get /api/products/:slug
 * @query {slug}
 * @description get product through slug
 * @return {success,message,product}
 */
productRouter.get("/:slug", getProductsValidator, GetProductThroughSlugHandler);

/**
 * @put /api/products
 * @body {title,description,shortDescription,category,subCategory,brand,mrp,stock,barcode,tags,status,visibility,isFeatured,discount,attributes,options}
 * @description update the products details as the body
 * @return {success,message,product}
 */
productRouter.put(
  "/:id",
  isUserVerified,
  isUserAdmin,
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
  isUserAdmin,
  UpdateProductsPatchHandler,
);
/**
 * @patch /api/products/:id/options
 * @body {remove:[{name:"",value:"",fileId:""}]}
 * @files {"name:value"}
 */
productRouter.patch(
  "/:id/options",
  upload.any(),
  isUserVerified,
  isUserAdmin,
  UpdateProductsOptionsHandler,
);
/**
 * @delete /api/products/:id
 * @description delete a product
 * @return {success,message}
 */
productRouter.delete("/:id", isUserVerified, isUserAdmin, DeleteProductHandler);

export default productRouter;
