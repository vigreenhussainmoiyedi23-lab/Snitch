import { config } from "../config/config.js";
import jwt, { type SignOptions } from "jsonwebtoken";
// If using TypeScript
export const createTokenFromData = (
  data: object,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(data, config.JWT_SECRET, { expiresIn: expiresIn ?? "1d" });
};
