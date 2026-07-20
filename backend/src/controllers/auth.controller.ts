import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { type RequestHandler } from "express";

export const registerController: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });
  const refreshToken = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  const session = await sessionModel.create({
    user: newUser._id,
    refreshToken,
    ip: req.ip ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown",
  });

  const accessToken = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
    expiresIn: "10m",
  });

  res
    .status(201)
    .json({ message: "User created successfully", success: true, accessToken });
};

export const loginController: RequestHandler = async (req, res) => {};
export const googleController: RequestHandler = async (req, res) => {};
export const meController: RequestHandler = async (req, res) => {};
export const refreshTokenController: RequestHandler = async (req, res) => {};
export const logoutController: RequestHandler = async (req, res) => {};
