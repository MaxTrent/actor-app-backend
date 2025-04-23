import { model, Schema, Types, Model } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

export interface IEndorsement extends Document {
  endorsed_by: Types.ObjectId;
  endorsed_user: Types.ObjectId;
  comment: String;
  rating: Number;
}

export interface IEndorsementModel extends Model<IEndorsement> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const endorsementSchema = new Schema(
  {
    endorsed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    endorsed_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

endorsementSchema.plugin(toJSON);
endorsementSchema.plugin(paginate);

const Endorsement = model<IEndorsement, IEndorsementModel>("Endorsement", endorsementSchema);

export default Endorsement;
