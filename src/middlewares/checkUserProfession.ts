import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "common/api-error";
import UserProfileModel from "lib/profile/models/userProfileModel";
import { UserProfileNamespace } from "lib/profile/userProfile";
import { error } from "console";

export const checkIfUserIsActor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.user.id;
    const user = await UserProfileNamespace.getUserProfile({ userId });

    if (!user) {
      const error = new ApiError(httpStatus.BAD_REQUEST, "User not found");
      next(error);
    }
    if (user.profession !== "Actor") {
      const error = new ApiError(httpStatus.FORBIDDEN, "User is not an actor");
      next(error);
    }
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.FORBIDDEN, "User is not an actor"));
  }
};

export const checkIfUserIsProducer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.user.id;
    const user = await UserProfileNamespace.getUserProfile({ userId });
    console.log("user", user);

    if (!user) {
      const error = new ApiError(httpStatus.BAD_REQUEST, "User not found");
      next(error);
    }
    if (user.profession !== "Producer") {
      const error = new ApiError(httpStatus.FORBIDDEN, "User is not a producer");
      next(error);
    }
    next();
  } catch (error) {
    return next(new ApiError(httpStatus.FORBIDDEN, "User is not a producer"));
  }
};
