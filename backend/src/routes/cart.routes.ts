import { Router } from "express";
import {
  DeleteCartHandler,
  DeleteCartItemHandler,
  GetCartHandler,
  UpdateCartItemHandler,
  AddToCartHandler,
} from "../controllers/cart.controller.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";

const cartRouter = Router();
/**
 * @get /api/cart
 * @description get cart or create if not exist
 * @return {success,message,cart}
 */
cartRouter.get("/", isUserVerified, GetCartHandler);
/**
 * @put /api/cart
 * @body {productId,quantity,variantId}
 * @description add product or variant of product (if variantId is provided) to cart
 */
cartRouter.put("/", isUserVerified, AddToCartHandler);
/**
 * @patch /api/cart
 * @body {productId,increaseBy,decreaseBy,variantId}
 * @description update cart items quantity or remove cart item if quantity is less than equal to 0
 */
cartRouter.patch("/", isUserVerified, UpdateCartItemHandler);
/**
 * @delete /api/cart
 * @description delete all cart items
 */
cartRouter.delete("/", isUserVerified, DeleteCartHandler);
/**
 * @delete /api/cart/:productId
 * @body {variantId}
 * @description remove specific cart item from cart
 * @return {success,message,cart}
 */
cartRouter.delete("/:productId", isUserVerified, DeleteCartItemHandler);
export default cartRouter;
