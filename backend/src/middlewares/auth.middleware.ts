import type { RequestHandler } from "express";
import { getTokenData } from "../utils/jwt.util.js";
import { redis } from "../config/redis.js";

export const isUserVerified: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    const isBlackListed = await redis.get(`blacklist:${accessToken}`);
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = getTokenData(accessToken);

    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token " });
    }

    req.user = decoded._id;
    next();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
