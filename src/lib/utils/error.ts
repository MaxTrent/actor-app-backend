import ApiError from "common/api-error";
import { NextFunction } from "express";

export const handleControllerError = (error: any, errorMessage: string, next: NextFunction) => {
  if (!(error instanceof ApiError)) {
    next(new ApiError(500, errorMessage));
  } else {
    next(error);
  }
};
