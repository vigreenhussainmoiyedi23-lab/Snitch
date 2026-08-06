import { useAppDispatch } from "../../../app/redux/hook";
import { setLoading } from "../cart.slice";
import {
  GetCartHandler,
  AddToCartHandler,
  UpdateCartItemHandler,
  DeleteCartHandler,
  DeleteCartItemHandler,
} from "../services/api.service";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const GetCartHandler = async () => {
    dispatch(setLoading(true));
    try {
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  };
  return {};
};
