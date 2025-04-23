import path from "path";
import cloudinary from "config/cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "config";
import ApiError from "common/api-error";
import httpStatus from "http-status";

console.log("Cloudinary Posts Folder:", config.cloudinaryPostsFolder);

const videoFileFilter = (
  req: any,
  file: { mimetype: string },
  cb: (arg0: Error | ApiError, arg1: boolean) => void
) => {
  const allowedMimeTypes = ["video/mp4"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(httpStatus.BAD_REQUEST, "Invalid file type. Only video files are allowed."),
      false
    );
  }
};

const uploadPostMediaMiddleware = (folderName: string) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const folderPath = `${folderName.trim()}`;
      const fileExtension = path.extname(file.originalname).substring(1);
      const publicId = `${file.fieldname}-${Date.now()}`;

      return {
        folder: folderPath,
        public_id: publicId,
        format: fileExtension,
        resource_type: "video"
      };
    }
  });

  return multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: {
      fileSize: 50 * 1024 * 1024 // keep file size < 50 MB
    }
  });
};

export const uploadPost = uploadPostMediaMiddleware(config.cloudinaryPostsFolder);
