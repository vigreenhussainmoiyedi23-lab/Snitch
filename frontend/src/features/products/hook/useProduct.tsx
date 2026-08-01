import { toast } from "react-toastify";
import { useApiError } from "../../../app/handleError";
import { useAppDispatch } from "../../../app/redux/hook";
import {
  setError,
  setProducts,
  setSlugProduct,
  setLoading,
} from "../productSlice";
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }
  async function GetAllProducts(params = {}) {
    setLoading(true);
    try {
      const response = await GetProductsAPI(params);
      dispatch(setProducts(response.products));
      console.log(response);

      return response;
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      setLoading(false);
    }
  }
  async function GetProductThroughSlug(slug: string) {
    setLoading(true);
    try {
      const response = await GetSingleProductAPI(slug);
      dispatch(setSlugProduct(response.product));
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      setLoading(false);
    }
  }
  return { createProductHandler, GetAllProducts, GetProductThroughSlug };
};
