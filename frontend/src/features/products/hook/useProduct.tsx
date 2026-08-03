import { toast } from "react-toastify";
import { useApiError } from "../../../app/handleError";
import { useAppDispatch } from "../../../app/redux/hook";
import {
  setError,
  
  setSlugProduct,
  setLoading,
  setEnums,
  setGetProducts,
} from "../productSlice";
import {
  CreateProductAPI,
  GetAllEnumsApi,
  GetProductsAPI,
  GetSingleProductAPI,
} from "../service/api.service";
import { toastSettings } from "../../../utils/ToastSettings";

export const useProduct = () => {
  const { handleError } = useApiError();
  const dispatch = useAppDispatch();
  async function createProductHandler(data: any) {
    const toastId = toast.loading("Creating Product...");
    dispatch(setLoading(true));
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
      dispatch(setLoading(false));
    }
  }
  async function GetAllProducts(params = {}) {
    dispatch(setLoading(true));
    try {
      const response = await GetProductsAPI(params);
      dispatch(setGetProducts(response));

      return response;
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function GetProductThroughSlug(slug: string) {
    dispatch(setLoading(true));
    try {
      const response = await GetSingleProductAPI(slug);
      dispatch(setSlugProduct(response.product));
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function GetAllEnumsHandler() {
    dispatch(setLoading(true));
    try {
      const response = await GetAllEnumsApi();
      dispatch(setEnums(response));
    } catch (error) {
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    createProductHandler,
    GetAllProducts,
    GetProductThroughSlug,
    GetAllEnumsHandler,
  };
};
