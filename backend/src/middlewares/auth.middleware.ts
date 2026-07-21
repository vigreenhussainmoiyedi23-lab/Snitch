import type { RequestHandler } from "express";
import { getTokenData } from "../utils/jwt.util.js";
import userModel from "../models/user.model.js";
import { hashToken } from "../utils/crypto.util.js";
import sessionModel from "../models/session.model.js";

export const isUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const decoded = getTokenData(token);
    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const userExists = await userModel.exists({ _id: decoded._id });
    if (!userExists) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const hashedRefreshToken = hashToken(token);
    const session = await sessionModel.findOne({
      user: decoded._id,
      refreshToken: hashedRefreshToken,
      revoke: false,
    });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded._id;
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const isUserVerified: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    const decoded = getTokenData(accessToken);
    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token" });
    }
    req.user = decoded._id;
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
