import { Router } from "express";
import {
  registerController,
  loginController,
  googleController,
  meController,
  refreshTokenController,
  logoutController,
  verifyOtpController,
  resendOtpHandler,
} from "../controllers/auth.controller.js";
import passport from "passport";
const authRouter = Router();

/**
 * @post Register
 * @body {email ,password ,username}
 * @return {success,message}
 * @description register user and send otp for verification
 */
authRouter.post("/register", registerController);
/**
 * @post Login
 * @body {email ,password}
 * @return {success,message}
 * @description login user
 */
authRouter.post("/login", loginController);
/**
 * @post Resend Otp
 * @body {email}
 * @return {success,message}
 * @description resend otp for verification
 */
authRouter.post("/resend-otp", resendOtpHandler);

/**
 * @post Verify Otp
 * @body {otp}
 * @return {success,message}
 * @description verify otp of the user whose id is in the token
 */
authRouter.post("/verifyOtp", verifyOtpController);
/**
 * @get google
 * @return {success,message}
 * @description login with google
 */
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);
/**
 * @get google/callback
 * @return {success,message}
 * @description login with google
 */
authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleController,
);
/**
 * @get me
 * @return {success,message}
 * @description get user details from the accessToken provided from frotnend
 */
authRouter.get("/me", meController);
/**
 * @get refresh-token
 * @return {success,message}
 * @description rotate tokens access Token and Refresh Token and update session
 */
authRouter.get("/refresh-token", refreshTokenController);

/**
 * @get logout
 * @return {success,message}
 * @description logout user and revoke session
 */
authRouter.get("/logout", logoutController);

export default authRouter;
