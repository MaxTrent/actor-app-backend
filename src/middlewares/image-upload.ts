import path from "path";
import cloudinary from "config/cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "config";
import ApiError from "common/api-error";
import httpStatus from "http-status";

console.log("Cloudinary Profile Picture Folder:", config.cloudinaryProfilePictureFolder);
console.log("Cloudinary Project Thumbnail Folder:", config.cloudinaryProjectsFolder);

const imageFileFilter = (
  req: any,
  file: { mimetype: string },
  cb: (arg0: Error | ApiError, arg1: boolean) => void
) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new ApiError(httpStatus.BAD_REQUEST, "Invalid file type. Only image files are allowed."),
      false
    );
  } else {
    cb(null, true);
  }
};

const uploadProfilePictureMediaMiddleware = (folderName: string) => {
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
        resource_type: "image"
      };
    }
  });

  return multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // keep file size < 10 MB
    }
  });
};

const uploadProjectThumbnailMiddleware = (folderName: string) => {
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
        resource_type: "image"
      };
    }
  });

  return multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 15 * 1024 * 1024 // keep file size < 15 MB
    }
  });
};

export const uploadProfilePicture = uploadProfilePictureMediaMiddleware(
  config.cloudinaryProfilePictureFolder
);
export const uploadProjectThumbnail = uploadProjectThumbnailMiddleware(
  config.cloudinaryProjectsFolder
);
