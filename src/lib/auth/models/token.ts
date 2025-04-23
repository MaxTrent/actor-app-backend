import { model, Schema, Types } from "mongoose";
import { toJSON } from "../../../models/plugins/toJSON";

export interface IToken extends Document {
  user_id: Types.ObjectId;
  token: String;
  expires_on: Date;
  last_used_at: Date;
}

const tokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    token: {
      type: String,
      required: true
    },
    expires_on: {
      type: Date,
      required: true
    },
    last_used_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

tokenSchema.plugin(toJSON);

const Token = model<IToken>("Token", tokenSchema);

export default Token;
