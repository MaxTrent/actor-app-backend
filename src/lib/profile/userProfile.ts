import ApiError from "common/api-error";
import httpStatus from "http-status";
import UserProfileModel, {
  IGender,
  IPlayableAge,
  IProfession,
  ISkinType,
  IUserProfile,
  UpdatableFields
} from "./models/userProfileModel";
import MediaUpload from "lib/engagements/models/mediaUpload";

import { TPaginationResult } from "models/plugins/paginate";

export class UserProfileNamespace {
  public static async createActorProfile({
    userId,
    profession,
    first_name,
    last_name,
    actual_age,
    playable_age,
    gender,
    skin_type
  }: {
    userId: string;
    profession: IProfession;
    first_name: string;
    last_name: string;
    actual_age: string;
    playable_age: IPlayableAge;
    gender: IGender;
    skin_type: ISkinType;
  }): Promise<IUserProfile> {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      const existingProfile = await UserProfileModel.findOne({ user_id: userId });
      if (existingProfile) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already have a profile");
      }

      if (profession !== "Actor") {
        throw new ApiError(httpStatus.BAD_REQUEST, "You must be an actor");
      }

      const newUser = await UserProfileModel.create({
        user_id: userId,
        profession,
        first_name,
        last_name,
        actual_age,
        playable_age,
        gender,
        skin_type
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  public static async createProducerProfile({
    userId,
    profession,
    first_name,
    last_name,
    film_maker_profile,
    company_name,
    company_email,
    company_phone_number,
    address,
    city,
    state,
    country,
    profile_picture
  }: {
    userId: string;
    profession: IProfession;
    first_name: string;
    last_name: string;
    film_maker_profile: string;
    company_name: string;
    company_email: string;
    company_phone_number: string;
    address: string;
    city: string;
    state: string;
    country: string;
    profile_picture: any;
  }): Promise<IUserProfile> {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      const existingProfile = await UserProfileModel.findOne({ user_id: userId });

      if (existingProfile) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You already have a profile");
      }

      if (profession !== "Producer") {
        throw new ApiError(httpStatus.BAD_REQUEST, "You must be a producer");
      }

      if (!profile_picture) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No file was uploaded for profile picture");
      }

      const imageUrl = profile_picture.path;
      const fileSize = (profile_picture.size / 1000000).toPrecision(2);
      const resourceId = profile_picture.filename;

      const mediaUpload = await MediaUpload.create({
        user_id: userId,
        cloud_provider: "cloudinary",
        resource_id: resourceId,
        media_type: "image",
        image_url: imageUrl,
        file_size: fileSize,
        uploaded_at: new Date()
      });

      const newUser = await UserProfileModel.create({
        user_id: userId,
        profession,
        first_name,
        last_name,
        profile_picture: mediaUpload.image_url,
        film_maker_profile,
        company_name,
        company_email,
        company_phone_number,
        address,
        city,
        state,
        country
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  public static async getUserProfile({ userId }: { userId: string }) {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      const userProfile = await UserProfileModel.findOne({ user_id: userId });

      if (!userProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, `User profile with id ${userId} not found`);
      }

      return userProfile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  public static async updateUserProfile({
    userId,
    updateData
  }: {
    userId: string;
    updateData: Partial<UpdatableFields>;
  }): Promise<IUserProfile> {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }
      if (!updateData || Object.keys(updateData).length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Update data is required");
      }

      const userProfile = await UserProfileModel.findOneAndUpdate(
        { user_id: userId },
        { $set: updateData },
        { new: true }
      );

      if (!userProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, `User profile with id ${userId} not found`);
      }

      return userProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  public static async checkProfileComplete<K extends keyof IUserProfile>({
    userId,
    field_name
  }: {
    userId: string;
    field_name: K;
  }): Promise<boolean> {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      if (!field_name) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Field name is required");
      }

      const userProfile = (await UserProfileModel.findOne({
        user_id: userId
      })) as IUserProfile | null;

      if (!userProfile || !(field_name in userProfile)) {
        throw new ApiError(httpStatus.NOT_FOUND, `User profile with field ${field_name} not found`);
      }

      const fieldValue = userProfile[field_name];

      if (fieldValue === "" || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking user profile field:", error);
      throw error;
    }
  }

  public static async returnProfileFieldValues({
    userId
  }: {
    userId: string;
  }): Promise<Record<string, boolean>> {
    try {
      if (!userId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
      }

      const userProfile = await UserProfileModel.findOne({ user_id: userId }).lean();

      if (!userProfile) {
        throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
      }

      const checkFieldFilled = (field: any): boolean => {
        if (field === null || field === undefined) return false;
        if (typeof field === "string" && field.trim() === "") return false;
        if (Array.isArray(field) && field.length === 0) return false;
        if (typeof field === "object" && Object.keys(field).length === 0) return false;
        return true;
      };

      const result: Record<string, boolean> = {};
      for (const [key, value] of Object.entries(userProfile)) {
        if (
          key !== "_id" &&
          key !== "__v" &&
          key !== "created_at" &&
          key !== "updated_at" &&
          value !== "N/A"
        ) {
          result[key] = checkFieldFilled(value);
        }
      }

      return result;
    } catch (error) {
      console.error("Error checking user profile field:", error);
      throw error;
    }
  }

  public static async addUserProfile(docs: TPaginationResult, userIdField: string = "user_id") {
    return await Promise.all(
      docs.results.map(async (doc) => {
        const userId = doc[userIdField];

        const userProfile = await UserProfileModel.findOne({ user_id: userId });

        const updatedDoc = {
          ...doc.toObject(),
          user_profile: userProfile
            ? {
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                profile_picture: userProfile.profile_picture
              }
            : null
        };

        return updatedDoc;
      })
    );
  }
}
