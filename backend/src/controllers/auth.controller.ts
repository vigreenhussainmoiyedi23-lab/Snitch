import userModel from "../models/user.model.js";
import { type RequestHandler } from "express";
import { CreateTokensAndSession } from "../services/auth.service.js";

export const registerController: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = await userModel.create({
    username,
    email,
    password,
  });
  const { refreshToken, accessToken } = await CreateTokensAndSession({
    _id: newUser._id.toString(),
    ip: req.ip ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res
    .status(201)
    .json({ message: "User created successfully", success: true, accessToken });
};
export const loginController: RequestHandler = async (req, res) => {};

export const googleController: RequestHandler = async (req, res) => {
  const {
    _json: { email, name },
  } = req.user as any;
  const isUserExist = await userModel.findOne({ email });
  let refreshToken, accessToken;
  if (isUserExist) {
    ({ refreshToken, accessToken } = await CreateTokensAndSession({
      _id: isUserExist._id.toString(),
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    }));
  } else {
    const newUser = await userModel.create({
      username: name,
      email,
    });

    ({ refreshToken, accessToken } = await CreateTokensAndSession({
      _id: newUser._id.toString(),
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    }));
  }
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "Google Authentication Successfully",
    accessToken,
  });
};

export const meController: RequestHandler = async (req, res) => {};
export const refreshTokenController: RequestHandler = async (req, res) => {};
export const logoutController: RequestHandler = async (req, res) => {};
