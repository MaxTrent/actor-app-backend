import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status";
import { validate } from "middlewares/validate";
import { authValidation } from "validations";
import { TokenNamespace } from "lib/auth/token";
import ResponseNamespace from "lib/utils/responses_namespace";
import { UserNamespace } from "lib/users/user";
import { PasswordResetNamespace } from "lib/auth/passwordReset";
import { handleControllerError } from "lib/utils/error";
import { EmailService } from "lib/services/messaging/email";
import { SmsService } from "lib/services/messaging/sms";

class AuthController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await TokenNamespace.refresh(refreshToken);
      return ResponseNamespace.sendSuccessMessage(
        res,
        { tokens },
        httpStatus.OK,
        "Token refreshed successfully"
      );
    } catch (error) {
      console.error("Failed to refresh token:", error);
      handleControllerError(error, "Failed to refresh token", next);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await TokenNamespace.invalidateRefreshToken(refreshToken);
      return ResponseNamespace.sendSuccessMessage(res, null, httpStatus.OK, "Logout successful");
    } catch (error) {
      console.error("Failed to logout:", error);
      handleControllerError(error, "Failed to logout", next);
    }
  }

  public async requestPasswordResetWithEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await UserNamespace.getUserByEmail(email);
      const otp = await PasswordResetNamespace.generatePasswordResetOtp(user, "email");
      await EmailService.sendPasswordResetOtp(user.email, otp);
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "Password reset request successful"
      );
    } catch (error) {
      console.log("error requesting password reset: ", error);
      handleControllerError(error, "Failed to request password reset", next);
    }
  }

  public async validatePasswordResetEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;

      const user = await UserNamespace.getUserByEmail(email);

      const confirmationId = await PasswordResetNamespace.validateResetPasswordOtp(
        user,
        otp,
        "email"
      );
      return ResponseNamespace.sendSuccessMessage(
        res,
        { confirmationId },
        httpStatus.OK,
        "Password reset OTP verified"
      );
    } catch (error) {
      console.error("Error validating password reset otp:", error);
      handleControllerError(error, "Error validating password reset otp", next);
    }
  }

  public async resetPasswordWithEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmationId, email, password } = req.body;

      const user = await UserNamespace.getUserByEmail(email);
      await PasswordResetNamespace.changePassword(user, password, confirmationId);
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "Password reset successful"
      );
    } catch (error) {
      console.log("Failed to reset password: ", error);
      handleControllerError(error, "Failed to reset password", next);
    }
  }

  public async requestPasswordResetWithPhoneNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { phone_number } = req.body;
      const user = await UserNamespace.getUserByPhoneNumber(phone_number);
      const otp = await PasswordResetNamespace.generatePasswordResetOtp(user, "phone_number");
      await SmsService.sendPasswordResetOtp(user.phone_number, otp);
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "Password reset request successful"
      );
    } catch (error) {
      console.log("error requesting password reset: ", error);
      handleControllerError(error, "Failed to request password reset", next);
    }
  }

  public async validatePasswordResetPhoneOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, phone_number } = req.body;

      const user = await UserNamespace.getUserByPhoneNumber(phone_number);

      const confirmationId = await PasswordResetNamespace.validateResetPasswordOtp(
        user,
        otp,
        "phone_number"
      );
      return ResponseNamespace.sendSuccessMessage(
        res,
        { confirmationId },
        httpStatus.OK,
        "Password reset OTP verified"
      );
    } catch (error) {
      console.error("Error validating password reset otp:", error);
      handleControllerError(error, "Error validating password reset otp", next);
    }
  }

  public async resetPasswordWithPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { confirmationId, phone_number, password } = req.body;

      const user = await UserNamespace.getUserByPhoneNumber(phone_number);
      await PasswordResetNamespace.changePassword(user, password, confirmationId);
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "Password reset successful"
      );
    } catch (error) {
      console.log("Failed to reset password: ", error);
      handleControllerError(error, "Failed to reset password", next);
    }
  }

  init() {
    this.router.post("/refresh", validate(authValidation.refresh), this.refresh);
    this.router.post("/logout", validate(authValidation.logout), this.logout);
    this.router.post(
      "/request-password-reset/email",
      validate(authValidation.requestPasswordResetEmail),
      this.requestPasswordResetWithEmail
    );
    this.router.post(
      "/request-password-reset/phone",
      validate(authValidation.requestPasswordResetPhone),
      this.requestPasswordResetWithPhoneNumber
    );
    this.router.post(
      "/request-password-reset/phone/validate-otp",
      validate(authValidation.validatePasswordResetPhoneOtp),
      this.validatePasswordResetPhoneOtp
    );
    this.router.post(
      "/request-password-reset/email/validate-otp",
      validate(authValidation.validatePasswordResetEmailOtp),
      this.validatePasswordResetEmailOtp
    );
    this.router.post(
      "/reset-password/email",
      validate(authValidation.resetPasswordEmail),
      this.resetPasswordWithEmail
    );
    this.router.post(
      "/reset-password/phone",
      validate(authValidation.resetPasswordPhone),
      this.resetPasswordWithPhone
    );
  }
}

export default new AuthController().router;
