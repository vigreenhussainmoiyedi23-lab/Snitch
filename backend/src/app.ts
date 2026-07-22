import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import "./config/passport.js";
import authRouter from "./routes/auth.routes.js";
import { config } from "./config/config.js";
import errorHandler from "./middlewares/error.middleware.js";
import helmet from "helmet";
import { apiLimiter } from "./Limiters/globalApi.limiter.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(passport.initialize());
app.use(apiLimiter);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: config.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/auth", authRouter);
app.use(errorHandler);
export default app;
