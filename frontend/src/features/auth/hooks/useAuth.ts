import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/redux/hook";
import {
  authFailure,
  authStart,
  authSuccess,
  registerSuccess,
  setUser,
} from "../authSlice";
import {
  LoginAPI,
  LogoutAPI,
  RegisterAPI,
  GetUserAPI,
  verifyOtpApi,
  refreshTokenApi,
  resendOtpApi,
} from "../service/api.service.js";
import { toast } from "react-toastify";
import { toastSettings } from "../../../utils/ToastSettings.js";
type ERROR = {
  response: {
    data: {
      message: string;
    };
  };
};

function isERROR(error: unknown): error is ERROR {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  );
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loginHandler = async (data: { email: string; password: string }) => {
    dispatch(authStart());
    const id = toast.loading("Logging in...");
    try {
      const response = await LoginAPI(data);
      dispatch(
        authSuccess({ user: response.user, accessToken: response.accessToken }),
      );
      toast.update(id, {
        render: "Login Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
    } catch (error: unknown) {
      if (isERROR(error)) {
        dispatch(authFailure(error!?.response!?.data.message!));
        toast.update(id, {
          render: error!?.response!?.data.message!,
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };

  const verifyOtpHandler = async (data: string) => {
    dispatch(authStart());
    const id = toast.loading("Verifying otp...");
    try {
      const response = await verifyOtpApi(data);
      dispatch(
        authSuccess({ user: response.user, accessToken: response.accessToken }),
      );
      toast.update(id, {
        render: "registered Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
    } catch (error: unknown) {
      if (isERROR(error)) {
        dispatch(authFailure(error!?.response!?.data.message!));
        toast.update(id, {
          render: error!?.response!?.data.message!,
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const RegisterHandler = async (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    dispatch(authStart());
    const id = toast.loading("Registering...");
    try {
      await RegisterAPI(data);
      dispatch(registerSuccess());
      toast.update(id, {
        render: "Registration Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
    } catch (error: unknown) {
      if (isERROR(error)) {
        dispatch(authFailure(error!?.response!?.data.message!));
        toast.update(id, {
          render: error!?.response!?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const LogoutHandler = async () => {
    dispatch(authStart());
    const id = toast.loading("Logging out...");
    try {
      await LogoutAPI();
      toast.update(id, {
        render: "Logout Successful",
        type: "success",
        isLoading: false,
        ...toastSettings,
      });
      navigate("/login");
    } catch (error: unknown) {
      if (isERROR(error)) {
        dispatch(authFailure(error!?.response!?.data.message!));
        toast.update(id, {
          render: error!?.response!?.data.message || "",
          type: "error",
          isLoading: false,
          ...toastSettings,
        });
      }
    }
  };
  const GetMeHandler = async () => {
    dispatch(authStart());
    try {
      const response = await GetUserAPI();

      dispatch(setUser(response.user));
    } catch (error) {
      dispatch(authFailure(""));
    }
  };
  const refreshTokenHand1er = async () => {
    dispatch(authStart());
    try {
      const response = await refreshTokenApi();
      dispatch(
        authSuccess({ user: response.user, accessToken: response.accessToken }),
      );
    } catch (error) {
      dispatch(authFailure(""));
    }
  };
  const resendOtpHandler = async () => {
    dispatch(authStart());
    try {
      await resendOtpApi();
    } catch (error) {
      dispatch(authFailure(""));
    }
  };
  return {
    loginHandler,
    RegisterHandler,
    LogoutHandler,
    GetMeHandler,
    verifyOtpHandler,
    refreshTokenHand1er,
    resendOtpHandler,
  };
};
