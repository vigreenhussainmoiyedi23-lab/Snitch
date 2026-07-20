
import jwt from "jsonwebtoken";
import sessionModel from "../models/session.model.js";
import { config } from "../config/config.js";
type TokenSessionParams = {
  _id: string;
  ip: string;
  userAgent: string;
};
export const CreateTokensAndSession = async ({
  _id,
  ip,
  userAgent,
}: TokenSessionParams) => {
  const refreshToken = jwt.sign({ id: _id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign({ id: _id }, config.JWT_SECRET, {
    expiresIn: "1d",
  });
  const session = await sessionModel.create({
    user: _id,
    refreshToken,
    ip,
    userAgent,
  });
  return { accessToken, refreshToken, session };
};
