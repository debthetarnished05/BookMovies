import * as OtpService from "./otp.service.js";
import * as UserService from "../user/user.service.js";
import * as TokenService from "./token.service.js";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils/index.js";

// Send OTP
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new createHttpError.BadRequest("Email is required"));
    }

    if (!isValidEmail(email)) {
      return next(new createHttpError.BadRequest("Invalid email format"));
    }

    // Generate OTP
    const otp = OtpService.generateOTP();

    // Hash OTP
    const ttl = 1000 * 60 * 2; // 2 minutes
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hashedOTP = OtpService.hashOTP(data);

    // Send Email
    try {
      await OtpService.sendOTPtoEmail(email, otp);
    } catch (error) {
      console.log(error);
      return next(
        new createHttpError.InternalServerError(
          "Error sending OTP to email"
        )
      );
    }

    res.json({
      hash: `${hashedOTP}.${expires}`,
      email,
      msg: "OTP sent to email successfully ✅",
    });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res, next) => {
  const { email, otp, hash } = req.body;

  if (!email || !otp || !hash) {
    return next(
      new createHttpError.BadRequest("All fields are required")
    );
  }

  // Verify OTP
  const [hashedOTP, expires] = hash.split(".");

  if (Date.now() > Number(expires)) {
    return next(new createHttpError.Unauthorized("OTP Expired"));
  }

  const data = `${email}.${otp}.${expires}`;
  const isValid = OtpService.verifyOTP(hashedOTP, data);

  if (!isValid) {
    return next(new createHttpError.Unauthorized("Invalid OTP"));
  }

  // Find or Create User
  let user;

  try {
    user = await UserService.getUserByEmail(email);

    if (!user) {
      user = await UserService.createUser({ email });
    }
  } catch (error) {
    return next(error);
  }

  // Generate Tokens
  const { accessToken, refreshToken } = TokenService.generateToken({
    _id: user._id,
    email: user.email,
  });

  // Store Refresh Token
  await TokenService.storeRefreshToken(user._id, refreshToken);

  // Cookies
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({
    auth: true,
    user,
  });
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await TokenService.deleteRefreshToken(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      msg: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token
export const refreshToken = async (req, res, next) => {
  const { refreshToken: refreshTokenFromCookies } = req.cookies;

  if (!refreshTokenFromCookies) {
    return next(
      new createHttpError.Unauthorized(
        "Refresh token not found, please login again"
      )
    );
  }

  let decodedToken;

  try {
    decodedToken = TokenService.verifyRefreshToken(
      refreshTokenFromCookies
    );
  } catch (error) {
    return next(
      new createHttpError.Unauthorized(
        "Invalid refresh token, please login again"
      )
    );
  }

  // Check DB
  try {
    const token = await TokenService.findRefreshToken(
      decodedToken._id,
      refreshTokenFromCookies
    );

    if (!token) {
      return next(
        new createHttpError.Unauthorized(
          "Refresh token not found in database, please login again"
        )
      );
    }
  } catch (error) {
    return next(error);
  }

  // Generate new Tokens
  const { accessToken, refreshToken } = TokenService.generateToken({
    _id: decodedToken._id,
  });

  // Update Refresh Token
  try {
    await TokenService.updateRefreshToken(
      decodedToken._id,
      refreshToken
    );
  } catch (error) {
    return next(error);
  }

  // Send Cookies
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    auth: true,
  });
};