import { toast } from "react-toastify";
import { useApiError } from "../../../app/handleError";
import { useAppDispatch } from "../../../app/redux/hook";
import { setError, setProducts } from "../productSlice";
import {
  CreateProductAPI,
  GetProductsAPI,
  GetSingleProductAPI,
  UpdateProductPatchApi,
  UpdateProductPutAPI,
} from "../service/api.service";
import { toastSettings } from "../../../utils/ToastSettings";

export const useProduct = () => {
  const { handleError } = useApiError();
  const dispatch = useAppDispatch();
  async function createProductHandler(data: any) {
    const toastId = toast.loading("Creating Product...");
    try {
      await CreateProductAPI(data);
      toast.update(toastId, {
        render: "Product created Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
    } catch (error) {
      handleError(error, dispatch, setError, toastId);
      throw error;
    }
  }
  async function GetAllProducts(params={}) {
    console.log(params);
    try {
      const response = await GetProductsAPI(params);
      dispatch(setProducts(response.products));
      console.log(response);
      
      return response;
    } catch (error) {
      handleError(error, dispatch, setError);
    }
  }
  return { createProductHandler, GetAllProducts };
};
