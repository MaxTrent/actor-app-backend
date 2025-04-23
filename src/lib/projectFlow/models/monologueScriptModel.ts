import mongoose, { Document, Schema, Types } from "mongoose";
import { toJSON } from "models/plugins/toJSON";

export interface IMonologueScript extends Document {
  role_id: Types.ObjectId;
  project_id: Types.ObjectId;
  script: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

const MonologueScriptSchema: Schema = new Schema(
  {
    role_id: { type: Schema.Types.ObjectId, ref: "role" },
    project_id: { type: Schema.Types.ObjectId, ref: "project" },
    script: { type: String, required: true },
    title: { type: String, required: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

MonologueScriptSchema.plugin(toJSON);

const monologueScriptModel = mongoose.model<IMonologueScript>(
  "monologue script",
  MonologueScriptSchema
);

export default monologueScriptModel;
