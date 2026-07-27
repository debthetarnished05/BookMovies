import createHttpError from "http-errors";
import * as TokenService from "../modules/auth/token.service.js";
import * as UserService from "../modules/user/user.service.js";

export const isVerifiedUser = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return next(createHttpError(401, "Access token is missing"));
    }

    const decodedToken = await TokenService.verifyAccessToken(accessToken);

    const user = await UserService.getUserById(decodedToken._id);

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};2