import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};
interface AuthPayload {
  user: User;
  accessToken: string;
}
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    authSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.accessToken = action.payload.accessToken;
    },

    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.accessToken = "";
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { authStart, authFailure, authSuccess, logout, setUser ,registerSuccess ,setAccessToken} =
  authSlice.actions;

export default authSlice.reducer;
