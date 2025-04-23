import mongoose, { Document, Schema, Types } from "mongoose";
import { toJSON } from "models/plugins/toJSON";

export type IStatus = "accepted" | "rejected";
export interface IInvitation extends Document {
  producer_id: Types.ObjectId;
  actor_id: Types.ObjectId;
  role_id: Types.ObjectId;
  project_id: Types.ObjectId;
  status: IStatus;
  created_at: Date;
  updated_at: Date;
}

const InvitationSchema: Schema = new Schema(
  {
    producer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actor_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role_id: { type: Schema.Types.ObjectId, ref: "role" },
    project_id: { type: Schema.Types.ObjectId, ref: "project" },
    status: { type: String, enum: ["accepted", "rejected"] },
    script: { type: String },
    title: { type: String }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

InvitationSchema.plugin(toJSON);

const invitationModel = mongoose.model<IInvitation>("invitation", InvitationSchema);

export default invitationModel;
