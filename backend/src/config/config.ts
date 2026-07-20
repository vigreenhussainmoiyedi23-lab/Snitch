import "dotenv/config";

type CONFIG = {
  PORT: number;
  MONGO_URI: string;
  GOOGLE_SECRET_KEY: string;
  GOOGLE_CLIENT_ID: string;
  JWT_SECRET: string;
};
export const config: CONFIG = {
  PORT:
    typeof process.env.PORT === "number" && process.env.PORT
      ? process.env.PORT
      : 3000,
  MONGO_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/Snitch",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};
