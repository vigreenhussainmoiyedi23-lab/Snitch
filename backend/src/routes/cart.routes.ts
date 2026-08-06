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
 * @body {productId,quantity}
 * @description add product to cart
 */
cartRouter.put("/", isUserVerified, AddToCartHandler);
/**
 * @patch /api/cart
 * @body {productId,increaseBy,decreaseBy}
 * @description update cart items
 */
cartRouter.patch("/", isUserVerified, UpdateCartItemHandler);
/**
 * @delete /api/cart
 * @description delete all cart items
 */
cartRouter.delete("/", isUserVerified, DeleteCartHandler);
/**
 * @delete /api/cart/:productId
 * @description delete specific cart item or remove that item
 * @return {success,message,cart}
 */
cartRouter.delete("/:productId", isUserVerified, DeleteCartItemHandler);
export default cartRouter;
