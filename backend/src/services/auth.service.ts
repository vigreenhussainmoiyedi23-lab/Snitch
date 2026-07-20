import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import { createTokenFromData } from "../utils/jwt.util.js";

type TokenSessionParams = {
  _id: string;
  ip: string;
  userAgent: string;
  oldRefreshToken?: string;
};
export const CreateTokensAndSession = async ({
  _id,
  ip,
  userAgent,
}: TokenSessionParams) => {
  const refreshToken = createTokenFromData({ _id }, "7d");
  const accessToken = createTokenFromData({ _id }, "15min");
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const session = await sessionModel.create({
    user: _id,
    refreshToken: hashedRefreshToken,
    ip,
    userAgent,
  });

  return { accessToken, refreshToken, session };
};

export const createTokensAndUpdateSession = async ({
  _id,
  ip,
  userAgent,
  oldRefreshToken,
}: TokenSessionParams) => {
  const refreshToken = createTokenFromData({ _id }, "7d");
  const accessToken = createTokenFromData({ _id }, "15min");

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const hashedOldRefreshToken = crypto
    .createHash("sha256")
    .update(oldRefreshToken!)
    .digest("hex");

  await sessionModel.findOneAndUpdate(
    { user: _id, refreshToken: hashedOldRefreshToken },
    { refreshToken: hashedRefreshToken, ip, userAgent },
  );

  return { accessToken, refreshToken };
};
