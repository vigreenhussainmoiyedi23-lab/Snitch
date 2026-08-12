import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import {
  isValidProductId,
  isValidVariantOfProduct,
} from "../services/product.service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import SendEmail from "../utils/sendOtp.js";

export const GetCartHandler = asyncHandler(async (req, res) => {
  let cart = await cartModel
    .findOne({
      userId: req.user!._id,
    })
    .populate("cartItems.product");

  if (!cart) {
    cart = await cartModel.create({ userId: req.user!._id });
    return res.status(201).json({
      message: "Cart created successfully",
      success: true,
      cart,
    });
  }

  cart.cartItems.forEach(async (item, idx) => {
    if (item.product === null) {
      cart.cartItems.pull(item._id);
      SendEmail({
        to: req.user!.email,
        subject: "Product not found",
        html: `<h1 style="text-align: center;">Your Cart Product was either deleted by admin or not found</h1>`,
      });
    }
    if (item.isVariant) {
      await cart.populate(`cartItems.${idx}.variant`);
    }
  });
  await cart.save();

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
  const cart = await cartModel.findOne({ userId: req.user!._id }).populate({
    path: "cartItems.product",
    select: "finalPrice",
  });
  if (!cart) throw new AppError("Cart not found", 404);

  const item = cart?.cartItems.find((i) => {
    if (i.isVariant && variantId) return i.variant!.toString() === variantId;
    else return i.product.toString() === productId;
  });

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
  // Populate after saving
  await cart.populate(["cartItems.product", "cartItems.variant"]);

  const totalAmount = cart.cartItems.reduce((total, item: any) => {
    let finalPrice = item.product.finalPrice;
    if (item.isVariant) finalPrice = item.variant.finalPrice;    
    if(isNaN(finalPrice)) finalPrice = item.product.finalPrice
    return total + finalPrice * item.quantity;
  }, 0);
  cart.totalAmount = totalAmount;
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
    .populate({
      path: "cartItems.product",
      select: "finalPrice",
    });
  if (!cart) throw new AppError("Cart not found", 404);

  const item = cart.cartItems.find((item: any) => {
    if (!variantId && !item.isVariant)
      return item.product._id.toString() === productId;
    if (variantId && item.isVariant)
      return item.variant.toString() === variantId;
  });

  if (!item) {
    throw new AppError("Product not found in cart", 404);
  } else {
    item!.quantity += increaseBy - decreaseBy;
    if (item!?.quantity <= 0) {
      const index = cart.cartItems.findIndex(
        (item: any) => item.product._id.toString() === productId,
      );

      if (index !== -1) {
        cart.cartItems.splice(index, 1);
      }
    }
    if (item.isVariant) {
      cart.totalAmount =
        cart.totalAmount -
        item?.variant.finalPrice * decreaseBy +
        item?.variant.finalPrice * increaseBy;
    } else {
      cart.totalAmount =
        cart.totalAmount -
        item?.product.finalPrice * decreaseBy +
        item?.product.finalPrice * increaseBy;
    }
    await cart.save();
  }
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

  await isValidProductId(productId?.toString());

  const cart = await cartModel
    .findOne({
      userId: req.user!._id,
    })
    .populate({
      path: "cartItems.product",
      select: "finalPrice",
    });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const index = cart.cartItems.findIndex(
    (item) => item.product._id.toString() === productId,
  );

  if (index === -1) {
    throw new AppError("Product not found in cart", 404);
  }

  const item: any = cart.cartItems[index];
  if (!item) throw new AppError("Product not found in cart", 404);
  cart.totalAmount -= item.quantity * item.product.finalPrice;

  cart.cartItems.splice(index, 1);

  await cart.save();

  return res.status(200).json({
    message: "Cart item deleted successfully",
    success: true,
    cart,
  });
});
