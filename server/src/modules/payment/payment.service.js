import Razorpay from "razorpay";
import config from "../../config/config.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: config.razorpayKey,
  key_secret: config.razorpaySecret,
});

export const createOrder = async (paymentData) => {
  const { amount } = paymentData;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `bms-ticket_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return order;
};

export const verifyPayment = async (paymentData) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = paymentData;

  const expectedSignature = crypto
    .createHmac("sha256", config.razorpaySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};