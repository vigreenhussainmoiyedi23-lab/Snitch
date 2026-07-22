import { config } from "../config/config.js";
import jwt, { type SignOptions } from "jsonwebtoken";
export interface MyJwtPayload {
  _id: string;
}

// If using TypeScript
export const createTokenFromData = (
  data: object,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(data, config.JWT_SECRET, { expiresIn: expiresIn ?? "1d" });
};

export const getTokenData = (token: string) => {
  try {
    if (!token) return null;
    return jwt.verify(token,config.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
