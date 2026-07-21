import api from "../../../app/axios";

export const LoginAPI = async (data: { email: string; password: string }) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const RegisterAPI = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const LogoutAPI = async () => {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const GetUserAPI = async () => {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const verifyOtpApi = async (otp: string) => {
  try {
    const response = await api.post("/api/auth/verify-otp", { otp });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const resendOtpApi = async () => {
  try {
    const response = await api.get("/api/auth/resend-otp");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const refreshTokenApi = async () => {
  try {
    const response = await api.get("/api/auth/refresh-token");
    return response.data;
  } catch (error) {
    return error;
  }
};
