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
import type { product, variant } from "../../products/types/product.type";

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
              variantId: cartItem.variant?._id,
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
    selectedVairant: variant;
  }) => {
    dispatch(setLoading(true));
    try {
      await AddToCartAPI({
        productId: data.product._id,
        quantity: data.quantity,
        variantId: data.selectedVairant._id,
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
  const UpdateCartItemHandler = async (data: {
    productId: string;
    increaseBy?: number;
    decreaseBy?: number;
    variantId?: string;
  }) => {
    dispatch(setLoading(true));
    try {
      await UpdateCartItemAPI(data);
      const { cart } = await GetCartAPI();
      dispatch(setCart(cart));
    } catch (error) {
      cartOfLocalStorage.cartItems.map((cartItem: CartItem) => {
        if (cartItem.product._id.toString() === data.productId) {
          if (data.increaseBy) {
            cartItem.quantity += data.increaseBy;
          } else if (data.decreaseBy) {
            cartItem.quantity -= data.decreaseBy;
          }
        }
      });
      localStorage.setItem("cart", JSON.stringify(cartOfLocalStorage));
      dispatch(setCart(cartOfLocalStorage));
    } finally {
      dispatch(setLoading(false));
    }
  };
  const DeleteCartItemHandler = async (
    productId: string,
    variantId?: string,
  ) => {
    dispatch(setLoading(true));
    try {
      await DeleteCartItemAPI(productId, variantId);
      const { cart } = await GetCartAPI();
      dispatch(setCart(cart));
    } catch (error) {
      cartOfLocalStorage.filter((cartItem: CartItem) => {
        if (
          cartItem.variant?._id !== variantId &&
          cartItem.product._id !== productId
        )
          return true;
      });
      localStorage.setItem("cart", JSON.stringify(cartOfLocalStorage));
      dispatch(setCart(cartOfLocalStorage));
    } finally {
      dispatch(setLoading(false));
    }
  };
  const DeleteCartHandler = async () => {
    dispatch(setLoading(true));
    try {
      await DeleteCartAPI();
      dispatch(setCart({ cartItems: [], totalAmount: 0 }));
    } catch (error) {
      localStorage.removeItem("cart");
      dispatch(setCart({ cartItems: [], totalAmount: 0 }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    GetCartHandler,
    AddToCartHandler,
    UpdateCartItemHandler,
    DeleteCartItemHandler,
    DeleteCartHandler,
  };
};
