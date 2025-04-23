import { NextFunction, Request, Response, Router } from "express";
import httpStatus from "http-status";
import { OnboardingNamespace } from "../../lib/users/onboarding";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { validate } from "middlewares/validate";
import { userValidation } from "validations";
import { handleControllerError } from "lib/utils/error";

class OnboardingController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async initiateEmailSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      await OnboardingNamespace.initiateSignupWithEmail({
        email
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "A confirmation code has been sent to your email"
      );
    } catch (error) {
      console.error("Error initiating sign up with email:", error);
      handleControllerError(error, "Error initiating sign up with email", next);
    }
  }

  public async validateEmailSignupOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.body;

      const confirmationId = await OnboardingNamespace.validateEmailSignupOtp({ otp, email });
      return ResponseNamespace.sendSuccessMessage(
        res,
        { confirmationId },
        httpStatus.OK,
        "Sign up OTP verified"
      );
    } catch (error) {
      console.error("Error validating email signup otp:", error);
      handleControllerError(error, "Error validating email signup otp", next);
    }
  }

  public async finalizeEmailSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, confirmationId, fcmDeviceToken } = req.body;

      const data = await OnboardingNamespace.finalizeEmailSignup({
        email,
        password,
        confirmationId,
        fcmDeviceToken
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        data,
        httpStatus.OK,
        "You've successfully signed up on Nitoons!"
      );
    } catch (error) {
      console.error("Error finalizing sign up via email:", error);
      handleControllerError(error, "Error finalizing sign up via email", next);
    }
  }

  public async initiatePhoneSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number } = req.body;

      await OnboardingNamespace.initiateSignupWithPhone({
        phone_number
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        httpStatus.OK,
        "A confirmation code has been sent to your phone number"
      );
    } catch (error) {
      console.error("Error initiating sign up with phone:", error);
      handleControllerError(error, "Error initiating sign up with phone number", next);
    }
  }

  public async validatePhoneSignupOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, phone_number } = req.body;

      const confirmationId = await OnboardingNamespace.validatePhoneSignupOtp({
        otp,
        phone_number
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        { confirmationId },
        httpStatus.OK,
        "Sign up OTP verified"
      );
    } catch (error) {
      console.error("Error validating phone number signup otp:", error);
      handleControllerError(error, "Error validating phone number signup otp", next);
    }
  }

  public async finalizePhoneSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, password, confirmationId, fcmDeviceToken } = req.body;

      const data = await OnboardingNamespace.finalizePhoneSignup({
        confirmationId,
        phone_number,
        password,
        fcmDeviceToken
      });
      return ResponseNamespace.sendSuccessMessage(
        res,
        data,
        httpStatus.OK,
        "You've successfully signed up on Nitoons!"
      );
    } catch (error) {
      console.error("Error finalizing sign up via phone number:", error);
      handleControllerError(error, "Error finalizing sign up via phone number", next);
    }
  }

  public async loginUserEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fcmDeviceToken } = req.body;

      const user = await OnboardingNamespace.loginUserEmail({
        email,
        password,
        fcmDeviceToken
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        user,
        httpStatus.OK,
        "user logged in successfully"
      );
    } catch (error) {
      console.error("Error trying to login:", error);
      handleControllerError(error, "Error signing in user", next);
    }
  }

  public async loginUserPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone_number, password, fcmDeviceToken } = req.body;

      const user = await OnboardingNamespace.loginUserPhone({
        phone_number,
        password,
        fcmDeviceToken
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        user,
        httpStatus.OK,
        "user logged in successfully"
      );
    } catch (error) {
      console.error("Error trying to login:", error);
      handleControllerError(error, "Error signing in user", next);
    }
  }

  init() {
    this.router.post(
      "/signup/email/initiate",
      validate(userValidation.initiateEmailSignup),
      this.initiateEmailSignup
    );
    this.router.post(
      "/signup/email/validate-otp",
      validate(userValidation.validateEmailSignupOtp),
      this.validateEmailSignupOtp
    );
    this.router.post(
      "/signup/email/finalize",
      validate(userValidation.finalizeEmailSignup),
      this.finalizeEmailSignup
    );
    this.router.post(
      "/signup/phone/initiate",
      validate(userValidation.initiatePhoneSignup),
      this.initiatePhoneSignup
    );
    this.router.post(
      "/signup/phone/validate-otp",
      validate(userValidation.validatePhoneSignupOtp),
      this.validatePhoneSignupOtp
    );
    this.router.post(
      "/signup/phone/finalize",
      validate(userValidation.finalizePhoneSignup),
      this.finalizePhoneSignup
    );
    this.router.post(
      "/login/email/initiate",
      validate(userValidation.loginUserEmail),
      this.loginUserEmail
    );
    this.router.post(
      "/login/phone/initiate",
      validate(userValidation.loginUserPhone),
      this.loginUserPhone
    );
  }
}

export default new OnboardingController().router;
