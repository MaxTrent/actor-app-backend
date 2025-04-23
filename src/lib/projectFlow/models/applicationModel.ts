import mongoose, { Document, Schema, Types } from "mongoose";
import { toJSON } from "models/plugins/toJSON";

export interface IApplication extends Document {
  actor_id: Types.ObjectId;
  role_id: Types.ObjectId;
  project_id: Types.ObjectId;
  monologue_post: string;
  created_at: Date;
  updated_at: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    actor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role_id: { type: Schema.Types.ObjectId, ref: "role" },
    project_id: { type: Schema.Types.ObjectId, ref: "project" },
    monologue_post: { type: String }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

ApplicationSchema.plugin(toJSON);

const applicationModel = mongoose.model<IApplication>("role", ApplicationSchema);

export default applicationModel;
