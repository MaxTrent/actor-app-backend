import ApiError from "common/api-error";
import httpStatus from "http-status";
import User from "./models/user";

export class UserNamespace {
  public static async getUserById(userId: string, throwError: boolean = true) {
    const user = await User.findById(userId);
    if (!user && throwError) {
      throw new ApiError(httpStatus.NOT_FOUND, "The requested user does not exist");
    }
    return user;
  }

  public static async getUserByEmail(email: string, throwError: boolean = true) {
    const user = await User.findOne({ email });
    if (!user && throwError) {
      throw new ApiError(httpStatus.NOT_FOUND, "The requested user does not exist");
    }
    return user;
  }

  public static async getUserByPhoneNumber(phone_number: string, throwError: boolean = true) {
    const user = await User.findOne({ phone_number });
    if (!user && throwError) {
      throw new ApiError(httpStatus.NOT_FOUND, "The requested user does not exist");
    }
    return user;
  }
}
