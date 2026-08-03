import mongoose from "mongoose";
import { config } from "./config.js";

async function ConnectToDatabase(retries = 0) {
  console.log("Connecting to database...");
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("connected To Database");
  } catch (error) {
    if (retries < 5) {
      console.log("Connection To DB failed. Retrying ", 5 - retries, " left");
      await ConnectToDatabase(++retries);
    } else {
      throw error;
    }
  }
}

export default ConnectToDatabase;
