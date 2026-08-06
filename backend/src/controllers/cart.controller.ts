import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { isValidProductId } from "../services/product.service.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/AsyncHandler.js";

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
  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
});

export const AddToCartHandler = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  await isValidProductId(productId); // throws error if product not found
  const cart = await cartModel.findOne({ userId: req.user!._id });
  if (!cart) throw new AppError("Cart not found", 404);
  const isProductExistInCart = cart.cartItems.find(
    (item) => item.product.toString() === productId,
  );
  if (isProductExistInCart) {
    throw new AppError("Product already exists in cart", 400);
  } else {
    await cartModel.findOneAndUpdate(
      { userId: req.user!._id },
      {
        $push: {
          cartItems: {
            product: productId,
            quantity,
          },
        },
      },
    );
  }
  return res.status(201).json({
    message: "Product added to cart successfully",
    success: true,
  });
});

export const UpdateCartItemHandler = asyncHandler(async (req, res) => {
  const { productId, increaseBy = 0, decreaseBy = 0 } = req.body;
  await isValidProductId(productId); // throws error if product not found

  const cart = await cartModel.findOne({ userId: req.user!._id });
  if (!cart) throw new AppError("Cart not found", 404);

  const isProductExistInCart = cart.cartItems.find(
    (item) => item.product.toString() === productId,
  );
  if (!isProductExistInCart) {
    throw new AppError("Product not found in cart", 404);
  } else {
    const item = cart.cartItems.find(
      (item) => item.product.toString() === productId,
    );

    item!.quantity += increaseBy - decreaseBy;
    if (item!?.quantity <= 0) {
      const index = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId,
      );

      if (index !== -1) {
        cart.cartItems.splice(index, 1);
      }
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
  await cart.save();
  res.status(200).json({
    message: "Cart deleted successfully",
    success: true,
  });
});

export const DeleteCartItemHandler = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await isValidProductId(productId?.toString()); // throws error if product not found
  const cart = await cartModel.findOne({ userId: req.user!._id });
  if (!cart) throw new AppError("Cart not found", 404);
  const index = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (index === -1) throw new AppError("Product not found in cart", 404);
  cart.cartItems.splice(index, 1);
  await cart.save();
  return res.status(200).json({
    message: "Cart item deleted successfully",
    success: true,
  });
});
