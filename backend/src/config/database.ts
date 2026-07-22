import mongoose from "mongoose";
import { config } from "./config.js";

async function ConnectToDatabase() {
  let retries = 0;
  try {
    
    await mongoose.connect(config.MONGO_URI);
    console.log("connected To Database");
    
  } catch (error) {
    if (retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      retries++;
      ConnectToDatabase();
    }
    else{
        console.error("Could not connect to database");
    }
  }
}
export default ConnectToDatabase;