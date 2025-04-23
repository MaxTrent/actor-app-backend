import { convertToIntlformat, sendSMS } from "lib/utils/sms";

export class SmsService {
  public static async sendPasswordResetOtp(recipientPhoneNumber: string, otp: string) {
    try {
      const message = {
        to: convertToIntlformat(recipientPhoneNumber),
        body: `
        Your password reset OTP is: ${otp}
        Please enter this OTP to reset your password.`
      };
      await sendSMS(message);
    } catch (error) {
      throw error;
    }
  }

  public static async sendSignupOtp(recipientPhoneNumber: string, otp: string) {
    try {
      const message = {
        to: convertToIntlformat(recipientPhoneNumber),
        body: `
        Thank you for signing up with us! 
        Please use the following OTP to confirm your phone number: ${otp}`
      };
      await sendSMS(message);
    } catch (error) {
      throw error;
    }
  }
}
