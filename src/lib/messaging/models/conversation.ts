import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export interface IConversation extends Document {
  participants: [Types.ObjectId, Types.ObjectId];
  last_message: string;
  last_message_by: string;
  last_message_sent_at: Date;
}

export interface IConversationModel extends Model<IConversation> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const conversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: "User" }],
    last_message: {
      type: String
    },
    last_message_by: {
      type: String
    },
    last_message_sent_at: {
      type: Date
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
conversationSchema.plugin(toJSON);

// add pagination plugin
conversationSchema.plugin(paginate);

const Conversation = model<IConversation, IConversationModel>("Conversation", conversationSchema);

export default Conversation;
