import { toast } from "react-toastify";
import { useAppDispatch } from "../../../app/redux/hook";
import type { createVariant, updateVariant } from "../@types/types";
import { CreateVariantApi, DeleteVariantApi, GetVariantsApi, UpdateVariantApi } from "../services/api.service";
import { setError, setLoading, setVariants } from "../variant.slice";
import { toastSettings } from "../../../utils/ToastSettings";
import { useApiError } from "../../../app/handleError";

export const useVariant = () => {
  const dispatch = useAppDispatch();
  const { handleError } = useApiError();
  async function CreateVariantHandler(productId: string, data: createVariant) {
    const toastId = toast.loading("Creating Variant...");
    try {
      dispatch(setLoading(true));
      const response = await CreateVariantApi(productId, data);
      toast.update(toastId, {
        render: "Variant Created Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      return response;
    } catch (error) {
      handleError(error,dispatch,setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function GetVariantHandler(productId: string) {
    try {
      dispatch(setLoading(true));
      const response = await GetVariantsApi(productId);
      dispatch(setVariants(response.variants))
      return response;
    } catch (error) {
      handleError(error,dispatch,setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function UpdateVariantHandler(productId: string, data: updateVariant) {
    const toastId = toast.loading("Updating Variant...");
    try {
      dispatch(setLoading(true));
      const response = await UpdateVariantApi(productId, data);
      toast.update(toastId, {
        render: "Variant Created Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      return response;
    } catch (error) {
      handleError(error,dispatch,setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function DeleteVariantHandler(productId: string) {
    const toastId = toast.loading("Creating Variant...");
    try {
      dispatch(setLoading(true));
      const response = await DeleteVariantApi(productId);
      toast.update(toastId, {
        render: "Variant Created Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      return response;
    } catch (error) {
      handleError(error,dispatch,setError);
    } finally {
      dispatch(setLoading(false));
    }
  }
  return {
    CreateVariantHandler,
    GetVariantHandler,
    UpdateVariantHandler,
    DeleteVariantHandler,
  };
};
