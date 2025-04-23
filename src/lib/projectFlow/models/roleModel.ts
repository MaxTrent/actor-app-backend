import mongoose, { Document, Schema, Types } from "mongoose";
import { toJSON } from "models/plugins/toJSON";

export type IGender = "male" | "female" | "both";
export type IEndorsement = "most endorsed" | "least endorsed";
export type ISkinType =
  | "#FBD7C1"
  | "#DDC5A9"
  | "#F9E0AA"
  | "#D7C9BC"
  | "#EDBA85"
  | "#E4B48C"
  | "#EABD82"
  | "#BC9279"
  | "#A2876A"
  | "#8A5F3E"
  | "#AB6A47"
  | "#AB6C40"
  | "#8F614D"
  | "#58361A"
  | "#392315";
export type IPlayableAge = "18-24" | "25-34" | "35-54" | "56-74";

export interface IRole extends Document {
  project_id: Types.ObjectId;
  role_name: string;
  gender: IGender;
  avg_rating: number;
  country: string;
  actor_lookalike: string;
  endorsement: IEndorsement;
  category: string;
  skin_type: ISkinType;
  distance: number;
  playable_age: string;
  height: string;
  cast_start: Date;
  cast_end: Date;
  created_at: Date;
  updated_at: Date;
}

const RoleSchema: Schema = new Schema(
  {
    project_id: { type: Schema.Types.ObjectId, ref: "project", required: true },
    role_name: { type: "string", required: true },
    gender: { type: "string" },
    avg_rating: { type: "number" },
    country: { type: "string" },
    actor_lookalike: { type: "string" },
    endorsement: { type: "string", enum: ["most endorsed", "least endorsed"] },
    category: { type: "string" },
    skin_type: {
      type: String,
      enum: [
        "#FBD7C1",
        "#DDC5A9",
        "#F9E0AA",
        "#D7C9BC",
        "#EDBA85",
        "#E4B48C",
        "#EABD82",
        "#BC9279",
        "#A2876A",
        "#8A5F3E",
        "#AB6A47",
        "#AB6C40",
        "#8F614D",
        "#58361A",
        "#392315"
      ]
    },
    distance: { type: "number" },
    playable_age: { type: "string", enum: ["18-24", "25-34", "35-54", "56-74"] },
    height: { type: "string" },
    cast_start: { type: "Date" },
    cast_end: { type: "Date" }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

RoleSchema.plugin(toJSON);

const roleModel = mongoose.model<IRole>("role", RoleSchema);

export default roleModel;
