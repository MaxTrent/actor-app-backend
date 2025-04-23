import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export interface IFollower extends Document {
  followed_user: Types.ObjectId;
  followed_by: Types.ObjectId;
  followed_at: Date;
}

export interface IFollowerModel extends Model<IFollower> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const followerSchema = new Schema(
  {
    followed_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    followed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    followed_at: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
followerSchema.plugin(toJSON);

// add pagination plugin
followerSchema.plugin(paginate);

const Follower = model<IFollower, IFollowerModel>("Follower", followerSchema);

export default Follower;
