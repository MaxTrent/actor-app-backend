import { Schema, model } from "mongoose";
import { toJSON } from "../../../models/plugins/toJSON";

export interface ISignupEmailOtp extends Document {
  email: String;
  otp: String;
  expires_on: Date;
  is_used: Boolean;
  is_confirmed: Boolean;
}

const signupEmailOtpSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
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
signupEmailOtpSchema.plugin(toJSON);

const SignupEmailOtp = model<ISignupEmailOtp>("SignupEmailOtp", signupEmailOtpSchema);

export default SignupEmailOtp;
