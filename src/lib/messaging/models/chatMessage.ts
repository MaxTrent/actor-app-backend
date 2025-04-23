import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export enum ChatMessageType {
  Message = "message"
}

export interface IChatMessage extends Document {
  sent_by: Types.ObjectId;
  conversation_id: Types.ObjectId;
  message_type: ChatMessageType;
  message: string;
  sent_at: Date;
  read_by: Types.ObjectId[];
}

export interface IChatMessageModel extends Model<IChatMessage> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const chatMessageSchema = new Schema(
  {
    sent_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    message_type: {
      type: String,
      enum: [ChatMessageType.Message],
      default: ChatMessageType.Message
    },
    message: {
      type: String
    },
    sent_at: {
      type: Date,
      required: true
    },
    read_by: [
      {
        type: Types.ObjectId,
        ref: "Users"
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
chatMessageSchema.plugin(toJSON);

// add pagination plugin
chatMessageSchema.plugin(paginate);

const ChatMessage = model<IChatMessage, IChatMessageModel>("ChatMessage", chatMessageSchema);

export default ChatMessage;
