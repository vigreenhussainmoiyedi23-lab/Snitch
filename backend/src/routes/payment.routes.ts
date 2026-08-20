import { Router } from "express";
import Payment from "../models/payment.model.js";
import razorpay from "../config/razorpay.js";
import AppError from "../utils/AppError.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { isUserVerified } from "../middlewares/auth.middleware.js";
import cartModel from "../models/cart.model.js";
import { CalculateTotal } from "../services/cart.service.js";
const paymentRouter = Router();

paymentRouter.post(
  "/create",
  isUserVerified,
  asyncHandler(async (req, res) => {
    const cart = await cartModel.findOne({ userId: req.user!._id });

    if (!cart || cart.cartItems.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const totalAmount = await CalculateTotal(cart);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new AppError("Invalid cart amount", 400);
    }
    const options = {
      amount: Number(totalAmount) * 100,
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

paymentRouter.post("/verify", isUserVerified, async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = config.RAZORPAY_SECRET_KEY;

  try {
    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret,
    );
    if (result) {
      const payment = await Payment.findOne({
        razorpayOrderId,
        userId: req.user!._id,
      });
      if (!payment) {
        throw new AppError("Payment not found", 404);
      }
      const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

      if (razorpayPayment.order_id !== payment.orderId) {
        throw new AppError("Payment/order mismatch", 400);
      }

      if (razorpayPayment.amount !== payment.amount * 100) {
        throw new AppError("Payment amount mismatch", 400);
      }

      if (razorpayPayment.currency !== payment.currency) {
        throw new AppError("Currency mismatch", 400);
      }
      if (payment.status === "completed") {
        return res.json({
          status: "success",
          message: "Payment already verified",
        });
      }
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      console.log("Payment verified successfully");

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
