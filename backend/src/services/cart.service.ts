import AppError from "../utils/AppError.js";

export async function isItemInCart(
  productId: string,
  variantId: string,
  cart: any,
  throwError: boolean = true
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
