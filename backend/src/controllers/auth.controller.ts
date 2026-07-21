import userModel from "../models/user.model.js";
import { type RequestHandler } from "express";
import {
  CreateTokensAndSession,
  createTokensAndUpdateSession,
} from "../services/auth.service.js";
import { createTokenFromData, getTokenData } from "../utils/jwt.util.js";
import { clearSecureCookie, sendSecureCookie } from "../utils/cookie.util.js";
import { createUser } from "../services/userCRUD.service.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import SendEmail from "../utils/sendOtp.js";
import { hashToken } from "../utils/crypto.util.js";

export const registerController: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({ email });
  if (isUserExist && isUserExist.isVerified) {
    return res.status(400).json({ message: "User already exists" });
  }
  if (isUserExist && !isUserExist.isVerified) {
    await userModel.deleteOne({ email });
  }
  const otp = `` + Math.floor(100000 + Math.random() * 900000);
  const newUser = await createUser({
    username,
    email,
    password,
    otp,
    otpExpiresIn: new Date(Date.now() + 10 * 60 * 1000),
    authMethod: "email",
  });
  const html = `
  <h1 style="text-align: center;">Verification OTP</h1>
  <h1 style="text-align: center;">${otp}</h1>
  `;
  await SendEmail({
    to: email,
    subject: "Verification OTP",
    html,
  });
  const token = createTokenFromData({ _id: newUser._id }, "15min");
  sendSecureCookie(res, "tokenForOtp", token, 15 * 60 * 1000); // {res,name,value,maxAgeInMs}
  res
    .status(201)
    .json({ message: "Verifification OTP has been sent", success: true });
};

export const resendOtpHandler: RequestHandler = async (req, res) => {
  let decoded: any = null;
  const token = req.cookies.tokenForOtp;
  decoded = getTokenData(token);
  if (!decoded._id || !decoded) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const isUserExist = await userModel.findById(decoded._id);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exist" });
  }
  if (
    !isUserExist.otp &&
    isUserExist.otpExpiresIn &&
    isUserExist.otpExpiresIn.getTime() < Date.now()
  ) {
    return res.status(400).json({ message: "OTP has been expired" });
  }
  const otp = `` + Math.floor(100000 + Math.random() * 900000);
  isUserExist.otp = otp;
  await isUserExist.save();
  const html = `
  <h1 style="text-align: center;">New Verification OTP</h1>
  <h1 style="text-align: center;">${otp}</h1>
  `;
  await SendEmail({
    to: isUserExist.email,
    subject: "Verification OTP",
    html,
  });
  res
    .status(201)
    .json({ message: "Verifification OTP has been sent", success: true });
};
export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const isUserExist = await userModel.findOne({ email }).select("+password");
  console.log(isUserExist);

  if (
    !isUserExist ||
    !isUserExist.isVerified ||
    isUserExist.authMethod === "google"
  ) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const isPasswordMatch = await bcrypt.compare(password, isUserExist.password!);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const { accessToken, refreshToken } = await CreateTokensAndSession({
    _id: isUserExist._id.toString(),
    ip: req.ip ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown",
  });
  sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
  res.status(200).json({ message: "Login successful", accessToken });
};
export const googleController: RequestHandler = async (req, res) => {
  const {
    _json: { email, name },
  } = req.user as any;
  const isUserExist = await userModel.findOne({ email });
  let refreshToken, accessToken;
  if (isUserExist) {
    // assigning accessToken,refreshToken values
    ({ refreshToken, accessToken } = await CreateTokensAndSession({
      _id: isUserExist._id.toString(),
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    }));
  } else {
    const newUser = await createUser({
      email,
      username: name,
      isVerified: true,
    });
    // assigning accessToken,refreshToken values
    ({ refreshToken, accessToken } = await CreateTokensAndSession({
      _id: newUser._id.toString(),
      ip: req.ip ?? "unknown",
      userAgent: req.headers["user-agent"] ?? "unknown",
    }));
  }

  sendSecureCookie(res, "refreshToken", refreshToken, 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
  res.status(200).json({
    message: "Google Authentication Successfully",
    accessToken,
  });
};

export const verifyOtpController: RequestHandler = async (req, res) => {
  const { otp } = req.body;
  let decoded: any = null;
  const token = req.cookies.tokenForOtp;
  decoded = getTokenData(token);
  if (!decoded._id || !decoded) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const isUserExist = await userModel.findById(decoded._id);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exist" });
  }
  if (
    !isUserExist.otp &&
    isUserExist.otpExpiresIn &&
    isUserExist.otpExpiresIn.getTime() < Date.now()
  ) {
    return res.status(400).json({ message: "OTP has been expired" });
  }
  const isOTPCorrect = await bcrypt.compare(otp, isUserExist.otp!);
  if (!isOTPCorrect) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  isUserExist.otp = null;
  isUserExist.otpExpiresIn = null;
  isUserExist.isVerified = true;
  await isUserExist.save();

  const { accessToken, refreshToken } = await CreateTokensAndSession({
    _id: isUserExist._id.toString(),
    ip: req.ip ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown",
  });

  sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
  res.status(200).json({ message: "OTP verified successfully", accessToken });
};

export const meController: RequestHandler = async (req, res) => {
  let decoded;
  try {
    const accessToken = req.headers!.authorization!.split(" ")[1];
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });
    decoded = getTokenData(accessToken!);
    if (!decoded || typeof decoded !== "object" || !decoded._id) {
      return res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
  try {
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const refreshTokenController: RequestHandler = async (req, res) => {
  const token = req.cookies.refreshToken;
  const decoded = getTokenData(token);
  const hashedOldRefreshToken = hashToken(token);
  const activeSession = await sessionModel.findOne({
    refreshToken: hashedOldRefreshToken,
    revoke: false,
  });
  if (!activeSession) {
    return res.status(400).json({ message: "Invalid token" });
  }
  if (typeof decoded !== "object" || !decoded || !decoded._id) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const isUserExist = await userModel.findById(decoded._id);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const { accessToken, refreshToken } = await createTokensAndUpdateSession({
    _id: isUserExist._id.toString(),
    ip: req.ip ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown",
    oldRefreshToken: token,
  });
  sendSecureCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000); // {res,name,value,maxAgeInMs}
  res
    .status(200)
    .json({ message: "Token refreshed successfully", accessToken });
};
export const logoutController: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const decoded = getTokenData(refreshToken);
  if (!decoded || typeof decoded !== "object" || !decoded._id) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const isUserExist = await userModel.findById(decoded._id);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exist" });
  }
  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken!)
    .digest("hex");
  await sessionModel.findOneAndUpdate(
    { user: isUserExist._id, refreshToken: hashedRefreshToken },
    { revoke: true },
  );
  clearSecureCookie(res, "refreshToken");
  res.status(200).json({ message: "Logout successfully" });
};
