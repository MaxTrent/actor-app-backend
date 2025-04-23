import Twilio from "twilio";
import { config } from "config";

const accountSid = config.twilioAccountId;
const authToken = config.twilioAuthToken;
const twilioPhoneNumber = config.twilioPhoneNumber;

const client = Twilio(accountSid, authToken);

export const sendSMS = async ({ to, body }: { to: string; body: string }) => {
  try {
    client.messages.create({
      body,
      from: twilioPhoneNumber,
      to
    });
  } catch (error) {
    throw error;
  }
};

export const convertToIntlformat = (phoneNumber: string) => {
  const countryCode = "+234";
  const formattedPhoneNumber = countryCode + phoneNumber.substring(1);
  return formattedPhoneNumber;
};
