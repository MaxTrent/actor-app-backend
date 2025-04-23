import { Schema, model } from "mongoose";
import { toJSON } from "../../../models/plugins/toJSON";

export interface ISignupPhoneOtp extends Document {
  phone: String;
  otp: String;
  expires_on: Date;
  is_used: Boolean;
  is_confirmed: Boolean;
}

const signupPhoneOtpSchema: Schema = new Schema(
  {
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    expires_on: { type: Date, required: true },
    is_used: { type: Boolean, default: false },
    is_confirmed: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts document to json
signupPhoneOtpSchema.plugin(toJSON);

const SignupPhoneOtp = model<ISignupPhoneOtp>("SignupPhoneOtp", signupPhoneOtpSchema);

export default SignupPhoneOtp;
