import createHttpError from "http-errors";
import * as UserService from "../modules/user/user.service.js";

export const isVerifiedUser = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return next(createHttpError(401, "User ID is missing in headers"));
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid User ID"));
  }
};