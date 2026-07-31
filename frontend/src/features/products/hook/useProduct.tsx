import { toast } from "react-toastify";
import { useApiError } from "../../../app/handleError";
import { useAppDispatch } from "../../../app/redux/hook";
import { setError } from "../productSlice";
import { CreateProductAPI } from "../service/api.service";

export const useProduct = () => {
  const { handleError } = useApiError();
  const dispatch = useAppDispatch();
  async function createProductHandler(data: any) {
    const toastId=toast.loading("Creating Product...");
    try {
      const response = await CreateProductAPI(data);
      console.log(response);
    } catch (error) {
      handleError(error, dispatch, setError,toastId);
      throw error
    }
  }
  return { createProductHandler };
};
