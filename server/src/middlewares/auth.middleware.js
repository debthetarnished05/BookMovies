import createHttpError from "http-errors";
import * as TokenService from "../modules/auth/token.service.js";
import * as UserService from "../modules/user/user.service.js";

export const isVerifiedUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createHttpError(401, "Access token missing"));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = TokenService.verifyAccessToken(token);
    } catch {
      return next(createHttpError(401, "Invalid or expired access token"));
    }

    const user = await UserService.getUserById(decoded.userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Authentication failed"));
  }
};