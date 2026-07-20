import { Router } from "express";
import {
  registerController,
  loginController,
  googleController,
  meController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth.controller.js";
import passport from "passport";
const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleController,
);
authRouter.get("/me", meController);
authRouter.get("refresh-token", refreshTokenController);
authRouter.get("/logout", logoutController);

export default authRouter;
