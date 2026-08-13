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
import {
  getLocalCart,
  saveLocalCart,
  isSameCartItem,
  EMPTY_CART
} from "./useLoacalStorage";
export const useCart = () => {
  const dispatch = useAppDispatch();

  const GetCartHandler = async () => {
    dispatch(setLoading(true));

    try {
      const localCart = getLocalCart();
      const { cart } = await GetCartAPI();

      // Sync guest/local cart into backend cart
      if (localCart.cartItems.length > 0) {
        await Promise.all(
          localCart.cartItems.map((cartItem) =>
            AddToCartAPI({
              productId: cartItem.product._id,
              quantity: cartItem.quantity,
              variantId: cartItem.variant?._id,
            }),
          ),
        );

        localStorage.removeItem("cart");

        // Get updated backend cart after merging
        const { cart: updatedCart } = await GetCartAPI();

        dispatch(setCart(updatedCart));
      } else {
        dispatch(setCart(cart));
      }
    } catch (error) {
      const localCart = getLocalCart();

      if (localCart.cartItems.length === 0) {
        saveLocalCart(EMPTY_CART);
        dispatch(setCart(EMPTY_CART));
      } else {
        dispatch(setCart(localCart));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const AddToCartHandler = async (data: {
    product: product;
    quantity: number;
    selectedVairant?: variant;
  }) => {
    dispatch(setLoading(true));

    try {
      await AddToCartAPI({
        productId: data.product._id,
        quantity: data.quantity,
        variantId: data.selectedVairant?._id,
      });

      const { cart } = await GetCartAPI();

      dispatch(setCart(cart));
    } catch (error) {
      const localCart = getLocalCart();

      const productId = data.product._id;
      const variantId = data.selectedVairant?._id;

      const existingItemIndex = localCart.cartItems.findIndex((cartItem) =>
        isSameCartItem(cartItem, productId, variantId),
      );

      if (existingItemIndex !== -1) {
        localCart.cartItems[existingItemIndex].quantity += data.quantity;
      } else {
        localCart.cartItems.push({
          product: data.product,
          quantity: data.quantity,
          variant: data.selectedVairant,
          isVariant: !!data.selectedVairant,
        } as CartItem);
      }

      saveLocalCart(localCart);

      dispatch(setCart(localCart));
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
      const localCart = getLocalCart();

      const item = localCart.cartItems.find((cartItem) =>
        isSameCartItem(cartItem, data.productId, data.variantId),
      );

      if (item) {
        if (data.increaseBy) {
          item.quantity += data.increaseBy;
        }

        if (data.decreaseBy) {
          item.quantity -= data.decreaseBy;
        }

        // Prevent quantity <= 0
        if (item.quantity <= 0) {
          localCart.cartItems = localCart.cartItems.filter(
            (cartItem) =>
              !isSameCartItem(cartItem, data.productId, data.variantId),
          );
        }
      }

      saveLocalCart(localCart);

      dispatch(setCart(localCart));
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
      const localCart = getLocalCart();

      localCart.cartItems = localCart.cartItems.filter(
        (cartItem) => !isSameCartItem(cartItem, productId, variantId),
      );

      saveLocalCart(localCart);

      dispatch(setCart(localCart));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const DeleteCartHandler = async () => {
    dispatch(setLoading(true));

    try {
      await DeleteCartAPI();

      localStorage.removeItem("cart");

      dispatch(setCart(EMPTY_CART));
    } catch (error) {
      localStorage.removeItem("cart");

      dispatch(setCart(EMPTY_CART));
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
