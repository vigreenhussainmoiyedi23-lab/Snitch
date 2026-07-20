import { Router } from "express";
import {
  registerController,
  loginController,
  googleController,
  meController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

authRouter.get("/auth/google", googleController);
authRouter.get("/me", meController);
authRouter.get("refresh-token", refreshTokenController);
authRouter.get("/logout", logoutController);
