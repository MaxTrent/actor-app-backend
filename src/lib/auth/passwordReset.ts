import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import ApiError from "common/api-error";
import generateAnOtp from "lib/utils/otp";
import PasswordResetOtp from "./models/passwordResetOtp";
import User, { IUser } from "../users/models/user";
import { getMinuteAgo, getNextMinute } from "lib/utils/time";

export class PasswordResetNamespace {
  public static async generatePasswordResetOtp(user: IUser, medium: "email" | "phone_number") {
    try {
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to request password reset");
      }

      const acceptedMediums = ["email", "phone_number"];

      if (!acceptedMediums.includes(medium)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Failed to request password reset");
      }

      const fiveMinutesAgo = getMinuteAgo(5);

      const recentPasswordResetOtp = await PasswordResetOtp.findOne({
        user_id: user._id,
        medium: medium,
        expires_on: { $gte: fiveMinutesAgo }
      });

      if (recentPasswordResetOtp) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "You can get a new otp after the previously requested one expires"
        );
      }

      const otp = generateAnOtp();
      const fiveMinutesFromNow = getNextMinute(5);
      await PasswordResetOtp.create({
        user_id: user._id,
        medium,
        otp: otp,
        expires_on: fiveMinutesFromNow
      });

      return otp;
    } catch (error) {
      throw error;
    }
  }

  public static async validateResetPasswordOtp(
    user: IUser,
    otp: string,
    medium: "email" | "phone_number"
  ) {
    try {
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password reset medium used");
      }

      const acceptedMediums = ["email", "phone_number"];

      if (!acceptedMediums.includes(medium)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid password reset medium used");
      }

      const fiveMinutesAgo = getMinuteAgo(5);
      const passwordResetOtp = await PasswordResetOtp.findOne({
        user_id: user._id,
        otp,
        medium,
        expires_on: { $gte: fiveMinutesAgo }
      });

      if (!passwordResetOtp || passwordResetOtp.is_used) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This otp is either used or expired");
      }

      passwordResetOtp.is_confirmed = true;
      await passwordResetOtp.save();

      return passwordResetOtp._id;
    } catch (error) {
      throw error;
    }
  }

  public static async changePassword(user: IUser, password: string, confirmationId: string) {
    try {
      const passwordResetOtp = await PasswordResetOtp.findOne({
        _id: confirmationId,
        user_id: user._id
      });

      if (!passwordResetOtp) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please request an otp to reset your password");
      }

      if (!passwordResetOtp.is_confirmed || passwordResetOtp.is_used) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This confirmation id is invalid or used");
      }

      passwordResetOtp.is_used = true;

      await passwordResetOtp.save();

      const hashedPassword = await bcrypt.hash(password, 8);
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        last_password_reset: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}
