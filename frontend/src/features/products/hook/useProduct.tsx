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
  DeleteProductAPI,
  GetAllEnumsApi,
  GetProductsAPI,
  GetSingleProductAPI,
  UpdateProductPatchApi,
  UpdateProductPutAPI,
} from "../service/api.service";
import { toastSettings } from "../../../utils/ToastSettings";
import { useNavigate } from "react-router-dom";

export const useProduct = () => {
  const { handleError } = useApiError();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      console.log(response, "response from backend");
      
      dispatch(setEnums(response));
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function UpdateProductsPutHandler(data: any) {
    dispatch(setLoading(true));
    try {
      const response = await UpdateProductPutAPI(data.id, data.data);
      return response;
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function UpdateProductsPatchHandler(data: { id: string; data: any }) {
    dispatch(setLoading(true));
    try {
      const response = await UpdateProductPatchApi(data.id, data.data);
      return response;
    } catch (error) {
      handleError(error, dispatch, setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function DeleteProductHandler(id: string) {
    dispatch(setLoading(true));
    const toastId = toast.loading("Deleting Product...");
    try {
      await DeleteProductAPI(id);
      toast.update(toastId, {
        render: "Product Deleted Successfully. Navigating to Product List",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      setTimeout(() => {
        navigate("/products");
      }, 500);
    } catch (error) {
      handleError(error, dispatch, setError, toastId);
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    createProductHandler,
    GetAllProducts,
    GetProductThroughSlug,
    GetAllEnumsHandler,
    UpdateProductsPutHandler,
    UpdateProductsPatchHandler,
    DeleteProductHandler,
  };
};
