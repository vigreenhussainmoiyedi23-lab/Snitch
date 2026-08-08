import { config } from "./config.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_API_KEY,
  key_secret: config.RAZORPAY_SECRET_KEY,
});

export default razorpay;