import mongoose, { Document, Schema, Types } from "mongoose";
import { toJSON } from "models/plugins/toJSON";

export interface IProject extends Document {
  producer_id: Types.ObjectId;
  project_name: String;
  description: String;
  thumbnail: String;
  published: boolean;
  cast_start: string;
  cast_end: string;
  created_at: Date;
  updated_at: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    producer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project_name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    cast_start: { type: String },
    cast_end: { type: String },
    published: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

ProjectSchema.plugin(toJSON);

const projectModel = mongoose.model<IProject>("project", ProjectSchema);

export default projectModel;
