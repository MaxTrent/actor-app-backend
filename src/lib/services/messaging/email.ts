import { config } from "config";
import { sendEmail } from "lib/utils/email";

export class EmailService {
  public static async sendPasswordResetOtp(recipientEmail: string, otp: string) {
    try {
      const message = {
        from: config.senderEmail,
        to: recipientEmail,
        subject: "Password Reset OTP"
      };
      const templatePath = "../src/templates/password-reset-otp.hbs"; // path relative to `dist` folder
      await sendEmail(message, templatePath, { otp });
    } catch (error) {
      throw error;
    }
  }

  public static async sendSignupOtp(recipientEmail: string, otp: string) {
    try {
      const message = {
        from: config.senderEmail,
        to: recipientEmail,
        subject: "Sign-Up Confirmation OTP"
      };
      const templatePath = "../src/templates/signup-otp.hbs";
      await sendEmail(message, templatePath, { otp, otpValidity: 5 });
    } catch (error) {
      throw error;
    }
  }
}
