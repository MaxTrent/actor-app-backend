import ApiError from "common/api-error";
import Endorsement from "./models/endorsement";
import UserProfileModel from "lib/profile/models/userProfileModel";
import { UserNamespace } from "lib/users/user";
import httpStatus from "http-status";
import { UserProfileNamespace } from "lib/profile/userProfile";

export class EndorsementNamespace {
  public static async createNewEndorsement({
    endorsedBy,
    endorsedUser,
    comment,
    rating
  }: {
    endorsedBy: string;
    endorsedUser: string;
    comment: string;
    rating: number;
  }) {
    try {
      if (endorsedBy === endorsedUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can't endorse yourself");
      }

      const endorsementExists = await Endorsement.findOne({
        endorsed_by: endorsedBy,
        endorsed_user: endorsedUser
      });

      if (endorsementExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You've already endorsed this user");
      }

      const endorsedUserExists = await UserNamespace.getUserById(endorsedUser, false);

      if (!endorsedUserExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "The user you want to endorse doesn't exist");
      }

      const newEndorsement = await Endorsement.create({
        endorsed_by: endorsedBy,
        endorsed_user: endorsedUser,
        comment,
        rating
      });

      const userProfile = await UserProfileModel.findOne({ user_id: endorsedUser });

      if (userProfile) {
        userProfile.endorsements += 1;
        userProfile.total_ratings += rating;

        userProfile.average_rating = Number(
          (userProfile.total_ratings / userProfile.endorsements).toPrecision(2)
        );

        await userProfile.save();
      }

      return newEndorsement;
    } catch (error) {
      throw error;
    }
  }

  public static async queryEndorsements({
    userId,
    filter,
    options
  }: {
    userId: string;
    filter: any;
    options: any;
  }) {
    try {
      const sortBy = options.sortBy || "created_at:desc";
      const data = await Endorsement.paginate(
        { ...filter, endorsed_user: userId },
        { ...options, sortBy }
      );

      const results = await UserProfileNamespace.addUserProfile(data, "endorsed_by");
      data.results = results;

      return data;
    } catch (error) {
      throw error;
    }
  }
}
