import { createClient } from "redis";
import { config } from "./config.js";

export const redis = createClient({
 url:config.REDIS_URL
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export async function connectRedis(retries = 5): Promise<void> {
  try {
    if (redis.isOpen) return;

    await redis.connect();
    console.log("✅ Redis connected");
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    console.log(
      `Redis connection failed. Retrying... (${retries} attempts left)`,
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return connectRedis(retries - 1);
  }
}

