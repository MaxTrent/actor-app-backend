import ApiError from "common/api-error";
import LikedPost, { ILikedPost } from "./models/likedPost";
import Post from "./models/post";
import httpStatus from "http-status";
import { Request } from "express";
import MediaUpload from "./models/mediaUpload";
import cloudinary from "config/cloudinary";
import UserProfileModel from "lib/profile/models/userProfileModel";
import { UserProfileNamespace } from "lib/profile/userProfile";

export class PostNamespace {
  public static async createNewPost({
    description,
    visibility,
    mediaUpload,
    userId
  }: {
    description: string;
    visibility: string;
    mediaUpload: string;
    userId: string;
  }) {
    try {
      const mediaUploadExists = await MediaUpload.findById(mediaUpload);

      if (!mediaUploadExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "There's no media upload for this post");
      }

      const newPost = await Post.create({
        description,
        media_upload: mediaUpload,
        visibility: !visibility ? "public" : visibility,
        user_id: userId
      });

      await newPost.populate("media_upload");

      return newPost;
    } catch (error) {
      throw error;
    }
  }

  public static async getPost(postId: string, userId: string) {
    try {
      const post = await Post.findById(postId).populate("media_upload");

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "This post does not exist");
      }

      if (post.visibility === "private" && String(post.user_id) !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You're not authorized to view this post");
      }

      const userProfile = await UserProfileModel.findOne({ user_id: userId });

      return {
        ...post.toObject(),
        userProfile
      };
    } catch (error) {
      throw error;
    }
  }

  public static async likePost({ userId, postId }: { userId: string; postId: string }) {
    try {
      const post = await Post.findById(postId);

      if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This post does not exist");
      }

      const userLikedPost = await LikedPost.findOne({
        user_id: userId,
        post_id: postId
      });

      if (userLikedPost) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You've already liked this post");
      }

      await LikedPost.create({
        user_id: userId,
        post_id: postId,
        liked_at: new Date()
      });

      post.likes += 1;

      await post.save();

      return post.likes;
    } catch (error) {
      throw error;
    }
  }

  public static async unLikePost({ userId, postId }: { userId: string; postId: string }) {
    try {
      const post = await Post.findById(postId);

      if (!post) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This post does not exist");
      }

      const userLikedPost = await LikedPost.findOne({
        user_id: userId,
        post_id: postId
      });

      if (!userLikedPost) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You cant's unlike a post you haven't liked");
      }

      await LikedPost.deleteOne({
        user_id: userId,
        post_id: postId
      });

      post.likes -= 1;

      await post.save();

      return post.likes;
    } catch (error) {
      throw error;
    }
  }

  public static async queryPosts({
    userId,
    filter,
    options,
    authenticatedUserId,
    visibility
  }: {
    userId: string;
    filter: any;
    options: any;
    authenticatedUserId: string;
    visibility?: string;
  }) {
    try {
      let posts;

      if (visibility === "private") {
        if (userId !== authenticatedUserId)
          throw new ApiError(
            httpStatus.FORBIDDEN,
            "You're not authorized to view this user's private posts"
          );

        posts = await Post.paginate(
          { ...filter, user_id: userId, visibility: "private" },
          { ...options, populate: "media_upload" }
        );

        const results = await UserProfileNamespace.addUserProfile(posts);

        posts.results = results;

        return posts;
      } else {
        posts = await Post.paginate(
          { ...filter, user_id: userId, visibility: "public" },
          { ...options, populate: "media_upload" }
        );

        const results = await UserProfileNamespace.addUserProfile(posts);

        posts.results = results;

        return posts;
      }
    } catch (error) {
      throw error;
    }
  }

  public static async queryLikedPosts({
    userId,
    filter,
    options
  }: {
    userId: string;
    filter: any;
    options: any;
  }) {
    try {
      const posts = await LikedPost.paginate(
        { ...filter, user_id: userId },
        { ...options, populate: "post_id.media_upload" }
      );
      let results = posts.results as ILikedPost[];
      const allPosts = results.map((result) => result.post_id);
      posts.results = allPosts;

      results = await UserProfileNamespace.addUserProfile(posts);

      posts.results = results;

      return posts;
    } catch (error) {
      throw error;
    }
  }

  public static async deletePost({ postId, userId }: { postId: string; userId: string }) {
    try {
      const post = await Post.findById(postId).populate("media_upload");

      if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, "The post you want to delete does not exist");
      }

      if (String(post.user_id) !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can't delete a post that's not yours");
      }

      await post.deleteOne();

      // delete post media
      const mediaUpload = await MediaUpload.findById(post.media_upload._id);

      await mediaUpload.deleteOne();

      if (post.media_upload.cloud_provider === "cloudinary") {
        const resourceId = post.media_upload.resource_id;
        await cloudinary.uploader.destroy(resourceId, {
          resource_type: "video",
          invalidate: true
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public static async savePostMedia(req: Request) {
    try {
      if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No file was uploaded");
      }

      const videoUrl = req.file.path;
      const fileSize = (req.file.size / 1000000).toPrecision(2);
      const resourceId = req.file.filename;

      const mediaUpload = await MediaUpload.create({
        user_id: req.user.id,
        cloud_provider: "cloudinary",
        resource_id: resourceId,
        media_type: "video",
        video_url: videoUrl,
        file_size: fileSize,
        uploaded_at: new Date()
      });

      return mediaUpload._id;
    } catch (error) {
      throw error;
    }
  }
}
