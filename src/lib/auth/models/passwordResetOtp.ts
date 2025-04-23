import { Schema, Types, model } from "mongoose";
import { toJSON } from "../../../models/plugins/toJSON";

export type TMedium = "email" | "phone_number";

export interface IPasswordResetOtp extends Document {
  user_id: Types.ObjectId;
  medium: TMedium;
  otp: String;
  expires_on: Date;
  is_used: Boolean;
  is_confirmed: Boolean;
}

const passwordResetOtpSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medium: { type: String, enum: ["email", "phone_number"], required: true },
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
passwordResetOtpSchema.plugin(toJSON);

const PasswordResetOtp = model<IPasswordResetOtp>("PasswordResetOtp", passwordResetOtpSchema);

export default PasswordResetOtp;
