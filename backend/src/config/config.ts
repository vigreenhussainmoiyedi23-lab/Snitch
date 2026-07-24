import "dotenv/config";

type CONFIG = {
  JWT_SECRET: string;
  MONGO_URI: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET_KEY: string;
  GOOGLE_REFRESH_TOKEN: string;
  GOOGLE_USER: string;
  REDIS_URL: string;
  FRONTEND_URL: string;
  IMAGEKIT_PRIVATE_KEY: string;
  IMAGEKIT_PUBLIC_KEY: string;
  PORT: number;
};
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is not defined");
if (!process.env.GOOGLE_SECRET_KEY)
  throw new Error("GOOGLE_SECRET_KEY is not defined");
if (!process.env.GOOGLE_REFRESH_TOKEN)
  throw new Error("GOOGLE_REFRESH_TOKEN is not defined");
if (!process.env.GOOGLE_USER) throw new Error("GOOGLE_USER is not defined");
if (!process.env.REDIS_URL) throw new Error("REDIS_URL is not defined");
if (!process.env.FRONTEND_URL) throw new Error("FRONTEND_URL is not defined");
if(!process.env.IMAGEKIT_PRIVATE_KEY) throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");
if(!process.env.IMAGEKIT_PUBLIC_KEY) throw new Error("IMAGEKIT_PUBLIC_KEY is not defined");
export const config: CONFIG = {
  PORT:
    typeof process.env.PORT === "number" && process.env.PORT
      ? process.env.PORT
      : 3000,
  MONGO_URI: process.env.MONGO_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,
  FRONTEND_URL: process.env.FRONTEND_URL,
  REDIS_URL: process.env.REDIS_URL,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
};
