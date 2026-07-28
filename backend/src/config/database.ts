import mongoose from "mongoose";
import { config } from "./config.js";

async function ConnectToDatabase(retries = 0) {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("connected To Database");
  } catch (error) {
    if (retries < 5) {
      retries++;
      await ConnectToDatabase(retries);
    } else {
      throw new Error("Database connection failed");
    }
  }
}

export default ConnectToDatabase;
