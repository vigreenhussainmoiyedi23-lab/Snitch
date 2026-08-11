import { Router } from "express";
import Payment from "../models/payment.model.js";
import razorpay from "../config/razorpay.js";
import AppError from "../utils/AppError.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";
import cartModel from "../models/cart.model.js";
const paymentRouter = Router();

paymentRouter.post(
  "/create",
  isUserVerified,
  asyncHandler(async (req, res) => {
    let cart = await cartModel.findOne({ userId: req.user!._id });
    let amount = cart?.totalAmount;

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
    };
    try {
      const order = await razorpay.orders.create(options);
      const newPayment = await Payment.create({
        orderId: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        status: "pending",
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(500).send("Error creating order");
    }
  }),
);

paymentRouter.post("/verify", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = config.RAZORPAY_SECRET_KEY;

  try {
    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret,
    );
    if (result) {
      const payment = await Payment.findOne({ orderId: razorpayOrderId });
      if (!payment) {
        throw new AppError("Payment not found", 404);
      }
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      console.log("Payment verified successfully :dsad");
      
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
});

export default paymentRouter;
