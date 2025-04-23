import httpStatus from "http-status";
import Follower from "./models/follower";
import ApiError from "common/api-error";
import UserProfileModel from "lib/profile/models/userProfileModel";
import { UserNamespace } from "lib/users/user";
import { UserProfileNamespace } from "lib/profile/userProfile";

export class FollowerNamespace {
  public static async queryUsersFollowing(userId: string, filter: any, options: any) {
    try {
      const sortBy = options.sortBy || "followed_at:desc";
      const followers = await Follower.paginate(
        { ...filter, followed_by: userId },
        { ...options, sortBy }
      );

      const results = await UserProfileNamespace.addUserProfile(followers, "followed_user");
      followers.results = results;
      return followers;
    } catch (error) {
      throw error;
    }
  }

  public static async queryFollowers(userId: string, filter: any, options: any) {
    try {
      const sortBy = options.sortBy || "followed_at:desc";
      const followers = await Follower.paginate(
        { ...filter, followed_user: userId },
        { ...options, sortBy }
      );

      const results = await UserProfileNamespace.addUserProfile(followers, "followed_by");
      followers.results = results;

      return followers;
    } catch (error) {
      throw error;
    }
  }

  public static async followUser(youUserId: string, userToFollowId: string) {
    try {
      const userToFollow = await UserNamespace.getUserById(userToFollowId, false);

      if (!userToFollow) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This user you want to follow does not exist");
      }

      const isFollowingUser = await Follower.findOne({
        followed_by: youUserId,
        followed_user: userToFollowId
      });

      if (isFollowingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You're already following this user");
      }

      await Follower.create({
        followed_by: youUserId,
        followed_user: userToFollowId,
        followed_at: new Date()
      });

      const userToFollowProfile = await UserProfileModel.findOne({
        user_id: userToFollowId
      });

      const yourProfile = await UserProfileModel.findOne({
        user_id: youUserId
      });

      if (userToFollowProfile && yourProfile) {
        const followers = Math.max(userToFollowProfile.followers + 1, 1);
        const following = Math.max(yourProfile.following + 1, 1);

        userToFollowProfile.followers = followers;
        yourProfile.following = following;

        await userToFollowProfile.save();
        await yourProfile.save();

        return userToFollowProfile.followers;
      }
    } catch (error) {
      throw error;
    }
  }

  public static async unFollowUser(youUserId: string, userToUnFollowId: string) {
    try {
      const userToUnFollow = await UserNamespace.getUserById(userToUnFollowId, false);

      if (!userToUnFollow) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This user you want to unfollow does not exist");
      }

      const isFollowingUser = await Follower.findOne({
        followed_by: youUserId,
        followed_user: userToUnFollowId
      });

      if (!isFollowingUser) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "You can't unfollow a user you aren't following"
        );
      }

      await Follower.deleteOne({
        followed_by: youUserId,
        followed_user: userToUnFollowId
      });

      const userToUnFollowProfile = await UserProfileModel.findOne({
        user_id: userToUnFollowId
      });

      const yourProfile = await UserProfileModel.findOne({
        user_id: youUserId
      });

      if (userToUnFollowProfile && yourProfile) {
        const followers = Math.max(userToUnFollowProfile.followers - 1, 0);
        const following = Math.max(yourProfile.following - 1, 0);

        userToUnFollowProfile.followers = followers;
        yourProfile.following = following;

        await userToUnFollowProfile.save();
        await yourProfile.save();

        return userToUnFollowProfile.followers;
      }
    } catch (error) {
      throw error;
    }
  }
}
