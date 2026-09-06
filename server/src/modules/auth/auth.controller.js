import * as UserService from "../user/user.service.js";
import * as TokenService from "./token.service.js";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils/index.js";
import bcrypt from "bcryptjs";

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return next(new createHttpError.BadRequest("All fields are required"));
    }

    if (!isValidEmail(email)) {
      return next(new createHttpError.BadRequest("Invalid email format"));
    }

    const existingUser = await UserService.getUserByEmail(email);
    if (existingUser) {
      return next(new createHttpError.BadRequest("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserService.createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      activateUser: true,
    });

    const payload = { userId: user._id, role: user.role };
    const { accessToken, refreshToken } = TokenService.generateToken(payload);
    await TokenService.storeRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      auth: true,
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new createHttpError.BadRequest("Email and password are required"));
    }

    const user = await UserService.getUserByEmail(email);

    if (!user || !user.password) {
      return next(new createHttpError.Unauthorized("Invalid email or password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new createHttpError.Unauthorized("Invalid email or password"));
    }

    const payload = { userId: user._id, role: user.role };
    const { accessToken, refreshToken } = TokenService.generateToken(payload);
    await TokenService.storeRefreshToken(user._id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      auth: true,
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token — issues a new access token using the refresh token cookie
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return next(createHttpError(401, "Refresh token missing"));
    }

    let decoded;
    try {
      decoded = TokenService.verifyRefreshToken(token);
    } catch {
      return next(createHttpError(401, "Invalid or expired refresh token"));
    }

    const stored = await TokenService.findRefreshToken(decoded.userId, token);
    if (!stored) {
      return next(createHttpError(401, "Refresh token not recognised"));
    }

    const user = await UserService.getUserById(decoded.userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    const payload = { userId: user._id, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } = TokenService.generateToken(payload);
    await TokenService.updateRefreshToken(user._id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await TokenService.deleteRefreshToken(token);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};