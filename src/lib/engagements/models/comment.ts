import { Document, Schema, Types, model } from "mongoose";
import { toJSON } from "../../../models/plugins/toJSON";

export interface IComment extends Document {
  user_id: Types.ObjectId;
  comment: string;
  likes: number;
  replies: any;
  created_at: Date;
  edited_at: Date;
}

const commentSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
    likes: { type: Number },
    replies: { type: Array }
  },
  {
    timestamps: { createdAt: "created_at", editedAt: "updated_at" }
  }
);

// add plugin that converts document to json
commentSchema.plugin(toJSON);

const CommentModel = model<IComment>("comment", commentSchema);

export default CommentModel;
