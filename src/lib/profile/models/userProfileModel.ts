import { toJSON } from "models/plugins/toJSON";
import mongoose, { Document, Schema, Types } from "mongoose";

export type IProfession = "Actor" | "Producer";
export type IPlayableAge = "18-24" | "25-34" | "35-54" | "56-74";
export type IGender = "male" | "female";
export type IEducation = "PHD" | "MSC" | "HND" | "OND" | "SSCE" | "N/A";
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

export type UpdatableFields = {
  first_name?: string;
  last_name?: string;
  actual_age?: string;
  playable_age?: IPlayableAge;
  gender?: IGender;
  skin_type?: ISkinType;
  preferred_roles?: string[];
  actor_lookalike?: string[];
  background_actor?: boolean;
  additional_skills?: string[];
  height?: string;
  primary_language?: string;
  other_languages?: string[];
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  front_headshot?: string;
  side_headshot?: string;
  link_to_reels?: string[];
  recent_projects?: {
    project_name: string;
    producer: string;
  }[];
  awards?: string[];
  education?: IEducation;
  film_maker_profile?: string;
  company_name?: string;
  company_email?: string;
  company_phone_number?: string;
  profile_picture?: string;
  endorsements?: number;
  total_ratings?: number;
};

export interface IUserProfile extends Document {
  user_id: Types.ObjectId;
  profession: IProfession;
  first_name: string;
  last_name: string;
  actual_age: string;
  playable_age: IPlayableAge;
  gender: IGender;
  skin_type: ISkinType;
  preferred_roles: string[];
  actor_lookalike: string[];
  background_actor: boolean;
  additional_skills: string[];
  height: string;
  primary_language: string;
  other_languages: string[];
  city: string;
  state: string;
  country: string;
  address: string;
  front_headshot: string;
  side_headshot: string;
  link_to_reels: string[];
  recent_projects: {
    project_name: string;
    producer: string;
  }[];
  awards: string[];
  education: IEducation;
  film_maker_profile: string;
  company_name: string;
  company_email: string;
  company_phone_number: string;
  profile_picture: string;
  endorsements: number;
  total_ratings: number;
  average_rating: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

const UserProfileSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    profession: { type: String, enum: ["Actor", "Producer"], required: true },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    actual_age: { type: String, default: "" },
    playable_age: { type: String, enum: ["18-24", "25-34", "35-54", "56-74"] },
    gender: { type: String, enum: ["male", "female"] },
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
    preferred_roles: [{ type: String, default: "" }],
    actor_lookalike: [{ type: String, default: "" }],
    background_actor: { type: Boolean },
    additional_skills: [{ type: String, default: "" }],
    height: { type: String, default: "" },
    primary_language: { type: String, default: "" },
    other_languages: [{ type: String, default: "" }],
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    address: { type: String, default: "" },
    front_headshot: { type: String, default: "" },
    side_headshot: { type: String, default: "" },
    link_to_reels: [{ type: String, default: "" }],
    recent_projects: [
      {
        project_name: { type: String, default: "" },
        producer: { type: String, default: "" }
      }
    ],
    awards: [{ type: String, default: "" }],
    education: { type: String, enum: ["PHD", "MSC", "HND", "OND", "SSCE", "N/A"], default: "N/A" },
    film_maker_profile: { type: String, default: "" },
    company_name: { type: String, default: "" },
    company_email: { type: String, default: "" },
    company_phone_number: { type: String, default: "" },
    profile_picture: { type: String, default: "" },
    endorsements: {
      type: Number,
      default: 0
    },
    total_ratings: {
      type: Number,
      default: 0
    },
    average_rating: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

UserProfileSchema.plugin(toJSON);

const UserProfileModel = mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);

export default UserProfileModel;
