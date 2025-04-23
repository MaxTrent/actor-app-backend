import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export interface ILikedPost extends Document {
  user_id: Types.ObjectId;
  post_id: Types.ObjectId;
  liked_at: Date;
}

export interface ILikedPostModel extends Model<ILikedPost> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const likedPostSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    post_id: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    liked_at: {
      type: Date
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
likedPostSchema.plugin(toJSON);

// add pagination plugin
likedPostSchema.plugin(paginate);

const LikedPost = model<ILikedPost, ILikedPostModel>("LikedPost", likedPostSchema);

export default LikedPost;
