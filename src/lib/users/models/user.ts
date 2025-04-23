import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { toJSON } from "../../../models/plugins/toJSON";

export type ISignupMeans = "email" | "phone_number";

export interface IUser extends Document {
  signup_means: ISignupMeans;
  email: string;
  password: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  disabled: Boolean;
  last_login: Date;
  last_password_reset: Date;
  fcm_device_token: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    signup_means: { type: String, enum: ["email", "phone_number"] },
    email: { type: String },
    password: { type: String, private: true }, // `private: true` used by the toJSON plugin
    phone_number: { type: String },
    disabled: { type: Boolean, default: false },
    last_login: { type: Date },
    last_password_reset: { type: String },
    fcm_device_token: { type: String }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts document to json
userSchema.plugin(toJSON);

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = model<IUser>("User", userSchema);

export default User;
