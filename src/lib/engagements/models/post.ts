import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";
import { IMediaUpload } from "./mediaUpload";

export type TPostVisibility = "public" | "private";

export interface IPost extends Document {
  user_id: Types.ObjectId;
  visibility: TPostVisibility;
  media_upload: IMediaUpload;
  description: String;
  likes: number;
  comments: number;
  posted_at: Date;
}

export interface IPostModel extends Model<IPost> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const postSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    media_upload: {
      type: Schema.Types.ObjectId,
      ref: "MediaUpload",
      required: true
    },
    description: {
      type: String
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    posted_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);

// add pagination plugin
postSchema.plugin(paginate);

const Post = model<IPost, IPostModel>("Post", postSchema);

export default Post;
