// hooks/useApiError.ts

import { toast } from "react-toastify";
import { toastSettings } from "../utils/ToastSettings";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function useApiError() {
  function handleError(
    error: unknown,
    dispatch?: (action: any) => void,
    action?: (message: string) => any,
    toastId?: string | number
  ) {
    let message = "Something went wrong";

    if (
      typeof error === "object" &&
      error &&
      "response" in error
    ) {
      message =
        (error as ApiError).response?.data?.message ??
        message;
    }

    if (dispatch && action) {
      dispatch(action(message));
    }

    if (toastId) {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        ...toastSettings,
      });
    } else {
      toast.error(message);
    }
  }

  return { handleError };
}