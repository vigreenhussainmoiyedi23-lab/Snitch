import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import AppError from "../utils/AppError.js";

export async function isItemInCart(
  productId: string,
  variantId: string,
  cart: any,
  throwError: boolean = true,
) {
  const index = cart.cartItems.findIndex((item: any) => {
    if (!variantId && !item.isVariant) {
      return item.product?._id?.toString() === productId;
    }

    if (variantId && item.isVariant) {
      return (
        item.product?._id?.toString() === productId &&
        item.variant?._id?.toString() === variantId
      );
    }

    return false;
  });

  if (index === -1 && throwError) {
    throw new AppError("Product not found in cart", 404);
  }

  return [cart.cartItems[index], index];
}

export async function CalculateTotal(cart: any) {
  await cart.populate(["cartItems.variant", "cartItems.product"]);
  const total = cart.cartItems.reduce((total: number, i: any) => {
    let finalPrice = i.product.finalPrice;
    if (i.isVariant) finalPrice = i.variant.finalPrice;
    if (isNaN(finalPrice)) finalPrice = i.product.finalPrice;
    return total + finalPrice * i.quantity;
  }, 0);
  cart.totalAmount = total;
  return total;
}
export async function GetCartWithTotalPrice(userId: string) {
  const cart = await cartModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$cartItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.product",
        foreignField: "_id",
        as: "cartItems.productDoc",
      },
    },
    {
      $unwind: {
        path: "$cartItems.productDoc",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "cartItems.variant",
        foreignField: "_id",
        as: "cartItems.variantDoc",
      },
    },
    {
      $addFields: {
        "cartItems.variantDoc": {
          $first: "$cartItems.variantDoc",
        },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            {
              $ne: ["$cartItems.productDoc", null],
            },
            {
              $or: [
                {
                  $eq: ["$cartItems.isVariant", false],
                },
                {
                  $and: [
                    {
                      $ne: ["$cartItems.variantDoc", null],
                    },
                    {
                      $in: [
                        "$cartItems.variantDoc._id",
                        "$cartItems.productDoc.variants",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $addFields: {
        "cartItems.product": "$cartItems.productDoc",
        "cartItems.variant": "$cartItems.variantDoc",
        itemPrice: {
          $multiply: [
            "$cartItems.quantity",
            {
              $cond: [
                "$cartItems.isVariant",
                "$cartItems.variantDoc.finalPrice",
                "$cartItems.productDoc.finalPrice",
              ],
            },
          ],
        },
      },
    },
    {
      $project: {
        "cartItems.productDoc": 0,
        "cartItems.variantDoc": 0,
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: {
          $first: "$userId",
        },
        __v: {
          $first: "$__v",
        },
        totalAmount: {
          $sum: "$itemPrice",
        },
        cartItems: {
          $push: "$cartItems",
        },
      },
    },
  ]);
  return cart[0];
}
