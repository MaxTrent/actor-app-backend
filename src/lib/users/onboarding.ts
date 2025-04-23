// This should contain the onboarding logic
import bcrypt from "bcryptjs";
import SignupEmailOtp from "./models/signupEmailOtp";
import SignupPhoneOtp from "./models/signupPhoneOtp";
import User, { IUser } from "./models/user";
import generateAnOtp from "../utils/otp";
import ApiError from "common/api-error";
import httpStatus from "http-status";
import { TokenNamespace } from "lib/auth/token";
import { EmailService } from "lib/services/messaging/email";
import { UserNamespace } from "./user";
import { getMinuteAgo, getNextMinute } from "lib/utils/time";
import { SmsService } from "lib/services/messaging/sms";
import UserProfileModel from "lib/profile/models/userProfileModel";

type IProfession = "Actor" | "Producer" | "none";

type LoginData = {
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  profession: IProfession;
};

export class OnboardingNamespace {
  public static async initiateSignupWithEmail(signupDetails: { email: string }) {
    try {
      const existingUser = await UserNamespace.getUserByEmail(signupDetails.email, false);

      if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A user with this email address already exists");
      }

      const expires_on = getNextMinute(5);

      const otp = generateAnOtp();

      await SignupEmailOtp.create({
        email: signupDetails.email,
        otp,
        expires_on
      });
      await EmailService.sendSignupOtp(signupDetails.email, otp);
    } catch (error) {
      throw error;
    }
  }

  public static async validateEmailSignupOtp({ otp, email }: { otp: string; email: string }) {
    const fiveMinutesAgo = getMinuteAgo(5);
    const signupOtp = await SignupEmailOtp.findOne({
      email,
      otp,
      expires_on: { $gte: fiveMinutesAgo }
    });

    if (!signupOtp || signupOtp.is_used) {
      throw new ApiError(httpStatus.BAD_REQUEST, "This otp is either used or expired");
    }

    signupOtp.is_confirmed = true;
    await signupOtp.save();

    return signupOtp._id;
  }

  public static async finalizeEmailSignup({
    email,
    password,
    confirmationId,
    fcmDeviceToken
  }: {
    confirmationId: string;
    email: string;
    password: string;
    fcmDeviceToken: string;
  }): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      const existingUser = await UserNamespace.getUserByEmail(email, false);

      if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A user with this email address already exists");
      }

      const emailSignupOtp = await SignupEmailOtp.findOne({
        _id: confirmationId,
        email: email
      });

      if (!emailSignupOtp) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please verify your email to finish your sign up"
        );
      }

      if (!emailSignupOtp.is_confirmed || emailSignupOtp.is_used) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This confirmation id is invalid or used");
      }

      emailSignupOtp.is_used = true;

      await emailSignupOtp.save();

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = await User.create({
        email: email,
        password: hashedPassword,
        signup_means: "email",
        fcm_device_token: fcmDeviceToken || ""
      });

      const tokens = await TokenNamespace.generateAuthTokens(String(newUser._id));

      return { user: newUser, tokens: tokens };
    } catch (error) {
      throw error;
    }
  }

  public static async initiateSignupWithPhone(signupDetails: { phone_number: string }) {
    try {
      const existingUser = await UserNamespace.getUserByPhoneNumber(
        signupDetails.phone_number,
        false
      );

      if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A user with this phone number already exists");
      }

      const expires_on = getNextMinute(5);

      const otp = generateAnOtp();

      await SignupPhoneOtp.create({
        phone: signupDetails.phone_number,
        otp,
        expires_on
      });
      await SmsService.sendSignupOtp(signupDetails.phone_number, otp);
    } catch (error) {
      throw error;
    }
  }

  public static async validatePhoneSignupOtp({
    otp,
    phone_number
  }: {
    otp: string;
    phone_number: string;
  }) {
    const fiveMinutesAgo = getMinuteAgo(5);
    const signupOtp = await SignupPhoneOtp.findOne({
      phone: phone_number,
      otp,
      expires_on: { $gte: fiveMinutesAgo }
    });

    if (!signupOtp || signupOtp.is_used) {
      throw new ApiError(httpStatus.BAD_REQUEST, "This otp is either used or expired");
    }

    signupOtp.is_confirmed = true;
    await signupOtp.save();

    return signupOtp._id;
  }

  public static async finalizePhoneSignup({
    confirmationId,
    phone_number,
    password,
    fcmDeviceToken
  }: {
    confirmationId: string;
    phone_number: string;
    password: string;
    fcmDeviceToken: string;
  }): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      const existingUser = await UserNamespace.getUserByPhoneNumber(phone_number, false);

      if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A user with this phone number already exists");
      }

      const phoneSignupOtp = await SignupPhoneOtp.findOne({
        _id: confirmationId,
        phone: phone_number
      });

      if (!phoneSignupOtp) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Please verify your email to finish your sign up"
        );
      }

      if (!phoneSignupOtp.is_confirmed || phoneSignupOtp.is_used) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This confirmation id is invalid or used");
      }

      phoneSignupOtp.is_used = true;

      await phoneSignupOtp.save();

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = await User.create({
        phone_number: phone_number,
        password: hashedPassword,
        signup_means: "phone_number",
        fcm_device_token: fcmDeviceToken || ""
      });

      const tokens = await TokenNamespace.generateAuthTokens(String(newUser._id));

      return { user: newUser, tokens: tokens };
    } catch (error) {
      throw error;
    }
  }

  public static async loginUserEmail(signupDetails: {
    password: string;
    email: string;
    fcmDeviceToken: string;
  }): Promise<LoginData> {
    const { password, email, fcmDeviceToken } = signupDetails;
    try {
      const user = await User.findOne({
        email
      });

      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
      }

      const passwordMatch = await user.isPasswordMatch(`${password}`);

      if (!passwordMatch) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password does not match");
      }

      const tokens = await TokenNamespace.generateAuthTokens(String(user._id));
      user.last_login = new Date();
      if (fcmDeviceToken) {
        user.fcm_device_token = fcmDeviceToken;
      }
      await user.save();

      const userProfile = await UserProfileModel.findOne({ user_id: String(user._id) });

      let profession: IProfession = "none";

      if (userProfile) {
        profession = userProfile.profession as IProfession;
      }

      return { user, tokens, profession };
    } catch (error) {
      console.error("error in login email logic");
      throw error;
    }
  }

  public static async loginUserPhone(signupDetails: {
    password: string;
    phone_number: string;
    fcmDeviceToken: string;
  }): Promise<LoginData> {
    const { password, phone_number, fcmDeviceToken } = signupDetails;
    try {
      const user = await User.findOne({
        phone_number
      });

      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
      }

      const passwordMatch = await user.isPasswordMatch(`${password}`);

      if (!passwordMatch) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password does not match");
      }

      const tokens = await TokenNamespace.generateAuthTokens(String(user._id));
      user.last_login = new Date();
      if (fcmDeviceToken) {
        user.fcm_device_token = fcmDeviceToken;
      }
      await user.save();

      const userProfile = await UserProfileModel.findOne({ user_id: String(user._id) });

      let profession: IProfession = "none";

      if (userProfile) {
        profession = userProfile.profession as IProfession;
      }

      return { user, tokens, profession };
    } catch (error) {
      console.error("error in login phone number logic");
      throw error;
    }
  }
}
