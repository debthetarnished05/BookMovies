import createHttpError from "http-errors";
import * as UserService from "../modules/user/user.service.js";

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return next(
      createHttpError(
        403,
        "Access denied. Superadmin role required."
      )
    );
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    return next(
      createHttpError(
        403,
        "Access denied. Admin role required."
      )
    );
  }

  next();
};