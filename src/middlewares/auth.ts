import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "common/api-error";
import { validateAccessToken } from "lib/utils/jwt";
import { UserNamespace } from "lib/users/user";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = await validateAccessToken(token);
      const user = await UserNamespace.getUserById(decoded?.id);
      if (user) {
        req.user = { id: user.id };
        next();
      } else {
        const error = new ApiError(
          httpStatus.UNAUTHORIZED,
          "You're not authorized to access this resource"
        );
        next(error);
      }
    } else {
      const error = new ApiError(
        httpStatus.BAD_REQUEST,
        "You're not authorized to access this resource"
      );
      next(error);
    }
  } catch (e) {
    console.log("Authorization failed: ", e);
    const error = new ApiError(
      httpStatus.BAD_REQUEST,
      "You're not authorized to access this resource"
    );
    next(error);
  }
};
