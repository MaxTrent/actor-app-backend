import httpStatus from "http-status";
import ApiError from "common/api-error";
import { NextFunction, Request, Response } from "express";
import vine, { errors } from "@vinejs/vine";

export const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = vine.compile(schema);
      const validatedInput = await validator.validate(req);
      Object.assign(req, validatedInput);
      return next();
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        const errorMessage = error.messages
          .map((error: { message: any }) => error.message)
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
    }
  };
