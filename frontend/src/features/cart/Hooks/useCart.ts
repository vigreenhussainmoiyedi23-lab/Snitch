import { useAppDispatch } from "../../../app/redux/hook";
import type { CartItem } from "../@types/cart.types";
import { setCart, setLoading } from "../cart.slice";
import {
  GetCartAPI,
  AddToCartAPI,
  UpdateCartItemAPI,
  DeleteCartAPI,
  DeleteCartItemAPI,
} from "../services/api.service";
import type { product } from "../../products/types/product.type";

export const useCart = () => {
  const dispatch = useAppDispatch();
  let cartOfLocalStorage = JSON.parse(
    localStorage.getItem("cart") ||
      JSON.stringify({
        cartItems: [],
        totalAmount: 0,
      }),
  );

  const GetCartHandler = async () => {
    dispatch(setLoading(true));
    try {
      const { cart } = await GetCartAPI();
      if (Object.keys(cartOfLocalStorage).length > 0) {
        await Promise.all(
          cartOfLocalStorage.cartItems.map((cartItem: CartItem) => {
            AddToCartAPI({
              productId: cartItem.product._id,
              quantity: cartItem.quantity,
            });
          }),
        );
        localStorage.removeItem("cart");
      }
      dispatch(setCart(cart));
    } catch (error) {
      if (cartOfLocalStorage.cartItems.length === 0) {
        cartOfLocalStorage = {
          cartItems: [],
          totalAmount: 0,
        };
        localStorage.setItem("cart", JSON.stringify(cartOfLocalStorage));
      } else {
        dispatch(setCart(cartOfLocalStorage));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const AddToCartHandler = async (data: {
    product: product;
    quantity: number;
  }) => {
    dispatch(setLoading(true));
    try {
      await AddToCartAPI({
        productId: data.product._id,
        quantity: data.quantity,
      });
      const { cart } = await GetCartAPI();
      dispatch(setCart(cart));
    } catch (error) {
      const idx = cartOfLocalStorage.cartItems.findIndex(
        (cartItem: CartItem) =>
          cartItem.product._id.toString() === data.product._id.toString(),
      );

      if (idx > -1) {
        cartOfLocalStorage.cartItems[idx].quantity += data.quantity;
      } else {
        cartOfLocalStorage.cartItems.push(data);
      }
      localStorage.setItem("cart", JSON.stringify(cartOfLocalStorage));
      dispatch(setCart(cartOfLocalStorage));
    } finally {
      dispatch(setLoading(false));
    }
  };
  return { GetCartHandler, AddToCartHandler };
};
