import * as PaymentService from "./payment.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await PaymentService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const isVerified = await PaymentService.verifyPayment(req.body);

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verification successful!",
    });
  } catch (error) {
    next(error);
  }
};