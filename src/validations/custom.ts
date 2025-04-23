import vine, { VineString } from "@vinejs/vine";
import ApiError from "common/api-error";
import httpStatus from "http-status";
import mongoose from "mongoose";

declare module "@vinejs/vine" {
  interface VineString {
    mongodbId(): this;
    phoneNumber(): this;
  }
}

function mongodbId(value: unknown, options: any, field: any) {
  if (typeof value !== "string") {
    return;
  }

  const notValid = !mongoose.Types.ObjectId.isValid(value);

  if (notValid) {
    field.report("The {{ field }} field is not valid", "mongodbId", field);
  }
}

function phoneNumber(value: any, options: any, field: any) {
  let notValid;
  if (value.charAt(0) !== "0") notValid = true;
  if (value.length !== 11) notValid = true;

  if (notValid) {
    field.report("The {{ field }} field is not valid", "phone number", field);
  }
}

export const mongodbIdRule = vine.createRule(mongodbId);
export const phoneNumberRule = vine.createRule(phoneNumber);

VineString.macro("mongodbId", function (this: VineString) {
  return this.use(mongodbIdRule());
});

VineString.macro("phoneNumber", function (this: VineString) {
  return this.use(phoneNumberRule());
});

export const validateMongodbId = (id: string, errorMessage?: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new ApiError(httpStatus.BAD_REQUEST, errorMessage || "Invalid data passed");
};
