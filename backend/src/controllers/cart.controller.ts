import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { CalculateTotal, GetCartWithTotalPrice, isItemInCart } from "../services/cart.service.js";
import {
  isValidProductId,
  isValidVariantOfProduct,
} from "../services/product.service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import SendEmail from "../utils/sendOtp.js";

export const GetCartHandler = asyncHandler(async (req, res) => {
  let cart = await GetCartWithTotalPrice(req.user!._id.toString());
  if (!cart) {
    cart = await cartModel.create({ userId: req.user!._id });
    return res.status(201).json({
      message: "Cart created successfully",
      success: true,
      cart,
    });
  }



  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
});

export const AddToCartHandler = asyncHandler(async (req, res) => {
  const { productId, quantity, variantId } = req.body;
  let isVariant = false;
  await isValidProductId(productId);

  if (variantId) await isValidVariantOfProduct(productId, variantId);
  const cart = await cartModel.findOne({ userId: req.user!._id });
  if (!cart) throw new AppError("Cart not found", 404);

  const [item] = await isItemInCart(productId, variantId, cart, false);

  if (item) {
    item.quantity = quantity;
  } else {
    if (variantId) isVariant = true;
    cart?.cartItems.push({
      product: productId,
      quantity,
      isVariant,
      variant: variantId,
    });
  }

  await CalculateTotal(cart);

  await cart.save();
  res.status(201).json({
    message: "Product added to cart successfully",
    success: true,
  });
});

export const UpdateCartItemHandler = asyncHandler(async (req, res) => {
  const { productId, variantId, increaseBy = 0, decreaseBy = 0 } = req.body;
  if (!increaseBy && !decreaseBy)
    throw new AppError("Quantity is required", 400);

  await isValidProductId(productId);
  if (variantId) await isValidVariantOfProduct(productId, variantId);
  const cart: any = await cartModel
    .findOne({ userId: req.user!._id })
    .populate([
      {
        path: "cartItems.product",
        select: "finalPrice",
      },
      {
        path: "cartItems.variant",
        select: "finalPrice",
      },
    ]);
  if (!cart) throw new AppError("Cart not found", 404);

  const [item] = await isItemInCart(productId, variantId, cart);

  const oldQuantity = item?.quantity;
  const finalPrice =
    item.isVariant && item.variant.finalPrice
      ? item.variant.finalPrice
      : item.product.finalPrice;

  item!.quantity += increaseBy - decreaseBy;

  if (item!?.quantity <= 0) {
    const index = cart.cartItems.findIndex(
      (i: any) => i._id.toString() === item._id.toString(),
    );

    if (index !== -1) {
      cart.cartItems.splice(index, 1);
      cart.totalAmount = cart.totalAmount - finalPrice * oldQuantity;
    }
  } else {
    cart.totalAmount =
      cart.totalAmount - finalPrice * decreaseBy + finalPrice * increaseBy;
  }

  await cart.save();

  return res.status(200).json({
    message: "Cart updated successfully",
    success: true,
    cart,
  });
});

export const DeleteCartHandler = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user!._id });
  if (!cart) throw new AppError("Cart not found", 404);
  cart.cartItems.splice(0);
  cart.totalAmount = 0;
  await cart.save();
  res.status(200).json({
    message: "Cart deleted successfully",
    success: true,
  });
});

export const DeleteCartItemHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.body;

  await isValidProductId(productId?.toString());
  if (variantId)
    await isValidVariantOfProduct(productId?.toString(), variantId);

  const cart = await cartModel
    .findOne({
      userId: req.user!._id,
    })
    .populate([
      {
        path: "cartItems.product",
        select: "finalPrice",
      },
      {
        path: "cartItems.variant",
        select: "finalPrice",
      },
    ]);

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const [item, index] = await isItemInCart(
    productId!.toString(),
    variantId,
    cart,
  );

  const finalPrice =
    item.isVariant && item.variant.finalPrice
      ? item.variant.finalPrice
      : item.product.finalPrice;
  cart.totalAmount -= item.quantity * finalPrice;

  cart.cartItems.splice(index, 1);

  await cart.save();

  return res.status(200).json({
    message: "Cart item deleted successfully",
    success: true,
    cart,
  });
});
