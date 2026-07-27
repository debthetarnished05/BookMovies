import express from "express";
import * as AuthController from "./auth.controller.js";
import { isVerifiedUser } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-otp", AuthController.sendOtp);

router.post("/verify-otp", AuthController.verifyOTP);

router.get("/refresh-token", AuthController.refreshToken);

router.post(
  "/logout",
  isVerifiedUser,
  AuthController.logout
);

export default router;