import * as UserService from "../user/user.service.js";
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
      activateUser: true
    });

    res.json({
      auth: true,
      user,
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

    res.json({
      auth: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      msg: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};