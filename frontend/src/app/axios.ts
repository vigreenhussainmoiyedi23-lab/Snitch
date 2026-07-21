import axios from "axios";
import { useAppSelector } from "./redux/hook";
import { store } from "./redux/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Retrieve and set your bearer token
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
