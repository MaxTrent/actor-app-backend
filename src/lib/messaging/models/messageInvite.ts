import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export enum MessageInviteStatus {
  Pending = "pending",
  Rejected = "rejected",
  Accepted = "accepted"
}

export interface IMessageInvite extends Document {
  sent_by: Types.ObjectId;
  invited_user: Types.ObjectId;
  message: String;
  sent_at: Date;
  status: MessageInviteStatus;
  rejected_at: Date;
  accepted_at: Date;
}

export interface IMessageInviteModel extends Model<IMessageInvite> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const messageInviteSchema = new Schema(
  {
    sent_by: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    invited_user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String
    },
    sent_at: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: [
        MessageInviteStatus.Pending,
        MessageInviteStatus.Rejected,
        MessageInviteStatus.Accepted
      ],
      default: MessageInviteStatus.Pending
    },
    rejected_at: {
      type: Date
    },
    accepted_at: {
      type: Date
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
messageInviteSchema.plugin(toJSON);

// add pagination plugin
messageInviteSchema.plugin(paginate);

const MessageInvite = model<IMessageInvite, IMessageInviteModel>(
  "MessageInvite",
  messageInviteSchema
);

export default MessageInvite;
