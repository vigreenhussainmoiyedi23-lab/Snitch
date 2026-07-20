import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import "./config/passport.js";
import authRouter from "./routes/auth.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/auth", authRouter);

export default app;
