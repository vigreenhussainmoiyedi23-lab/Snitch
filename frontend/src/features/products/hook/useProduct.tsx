import { toast } from "react-toastify";
import { useApiError } from "../../../app/handleError";
import { useAppDispatch } from "../../../app/redux/hook";
import { setError } from "../productSlice";
import { CreateProductAPI } from "../service/api.service";
import { toastSettings } from "../../../utils/ToastSettings";

export const useProduct = () => {
  const { handleError } = useApiError();
  const dispatch = useAppDispatch();
  async function createProductHandler(data: any) {
    const toastId=toast.loading("Creating Product...");
    try {
      const response = await CreateProductAPI(data);
      toast.update(toastId, {
        render: "Product created Successfully",
        type: "success",
        isLoading: false,
        ...toastSettings,
      })
    } catch (error) {
      handleError(error, dispatch, setError,toastId);
      throw error
    }
  }
  return { createProductHandler };
};
