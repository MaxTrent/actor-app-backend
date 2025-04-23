import { model, Schema, Types, Model, Document } from "mongoose";
import { toJSON } from "models/plugins/toJSON";
import { TPaginationResult, paginate } from "models/plugins/paginate";

// Define media types
enum MediaType {
  VIDEO = "video",
  IMAGE = "image"
}

// Media upload interface
export interface IMediaUpload extends Document {
  user_id: Types.ObjectId;
  resource_id: string;
  cloud_provider: string;
  media_type: MediaType;
  video_url?: string;
  image_url?: string;
  file_size: number;
  uploaded_at: Date;
}

export interface IMediaUploadModel extends Model<IMediaUpload> {
  paginate(filter: any, options: any): Promise<TPaginationResult>;
}

const mediaUploadSchema = new Schema<IMediaUpload>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resource_id: {
      type: String,
      required: true
    },
    cloud_provider: {
      type: String,
      required: true
    },
    media_type: {
      type: String,
      enum: Object.values(MediaType),
      required: true
    },
    video_url: {
      type: String
    },
    image_url: {
      type: String
    },
    // file size in megabytes
    file_size: {
      type: Number,
      required: true
    },
    uploaded_at: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

// add plugin that converts mongoose to json
mediaUploadSchema.plugin(toJSON);

// add pagination plugin
mediaUploadSchema.plugin(paginate);

const MediaUpload = model<IMediaUpload, IMediaUploadModel>("MediaUpload", mediaUploadSchema);

export default MediaUpload;
