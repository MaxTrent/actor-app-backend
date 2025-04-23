import { NextFunction, Request, Response, Router } from "express";
import { CommentNamespace } from "../../lib/engagements/comments";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { handleControllerError } from "lib/utils/error";
import { validate } from "middlewares/validate";
import { engagementValidation } from "validations";
import { auth } from "middlewares/auth";
import { EndorsementNamespace } from "lib/engagements/endorsements";
import { pick } from "lib/utils/pick";
import { FollowerNamespace } from "lib/engagements/follower";
import { PostNamespace } from "lib/engagements/post";
import { uploadPost } from "middlewares/video-upload";

class EngagementsController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async createComment(req: Request, res: Response) {
    try {
      const { comment } = req.body;

      const newComment = await CommentNamespace.createNewComment({ comment });
      return ResponseNamespace.sendSuccessMessage(
        res,
        newComment,
        res.status(200).statusCode,
        "user commented successfully"
      );
    } catch (error) {
      console.error("Error creating comments:", error);
      return ResponseNamespace.sendErrorMessage(
        req,
        res,
        error,
        res.status(500).statusCode,
        "Error creating comments"
      );
    }
  }

  public async editComment(req: Request, res: Response) {
    try {
      const { comment, alteredComment } = req.body;

      const editedComment = await CommentNamespace.editComment({ comment, alteredComment });

      return ResponseNamespace.sendSuccessMessage(
        res,
        editedComment,
        res.status(200).statusCode,
        "user edited comment successfully"
      );
    } catch (error) {
      console.error("Error editing comment:", error);
      return ResponseNamespace.sendErrorMessage(
        req,
        res,
        error,
        res.status(500).statusCode,
        "Error editing comments"
      );
    }
  }

  public async createEndorsement(req: Request, res: Response, next: NextFunction) {
    try {
      const { endorsedUser, comment, rating } = req.body;
      const userId = req.user.id;

      const endorsement = await EndorsementNamespace.createNewEndorsement({
        endorsedBy: userId,
        endorsedUser,
        comment,
        rating
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        endorsement,
        res.status(200).statusCode,
        "Endorsements retrieved"
      );
    } catch (error) {
      console.log("Error creating endorsement: ", error);
      handleControllerError(error, "Error creating endorsement", next);
    }
  }

  public async getEndorsements(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await EndorsementNamespace.queryEndorsements({ userId, filter, options });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Endorsements retrieved"
      );
    } catch (error) {
      console.log("Error retrieving endorsements: ", error);
      handleControllerError(error, "Error retrieving endorsements", next);
    }
  }

  public async followUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId: userToFollow } = req.body;
      const you = req.user.id;
      const followers = await FollowerNamespace.followUser(you, userToFollow);
      return ResponseNamespace.sendSuccessMessage(
        res,
        { followers },
        res.status(200).statusCode,
        "You've successfully followed this user"
      );
    } catch (error) {
      console.log(error);
      handleControllerError(error, "Failed to follow user", next);
    }
  }

  public async unFollowUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId: userToFollow } = req.body;
      const you = req.user.id;
      const followers = await FollowerNamespace.unFollowUser(you, userToFollow);
      return ResponseNamespace.sendSuccessMessage(
        res,
        { followers },
        res.status(200).statusCode,
        "You've successfully unfollowed this user"
      );
    } catch (error) {
      console.log(error);
      handleControllerError(error, "Failed to unfollow user", next);
    }
  }

  public async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await FollowerNamespace.queryFollowers(userId, filter, options);

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Followers retrieved"
      );
    } catch (error) {
      handleControllerError(error, "Failed to get followers", next);
    }
  }

  public async getUsersFollowing(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);
      const result = await FollowerNamespace.queryUsersFollowing(userId, filter, options);

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Users following retrieved"
      );
    } catch (error) {
      console.log("Failed to get followers: ", error);
      handleControllerError(error, "Failed to get followers", next);
    }
  }

  public async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { description, visibility, mediaUpload } = req.body;

      const newPost = await PostNamespace.createNewPost({
        description,
        visibility,
        mediaUpload,
        userId: req.user.id
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        newPost,
        res.status(200).statusCode,
        "You've successfully created a new post"
      );
    } catch (error) {
      handleControllerError(error, "Failed to create post", next);
    }
  }

  public async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const likes = await PostNamespace.likePost({ userId, postId });

      return ResponseNamespace.sendSuccessMessage(
        res,
        { likes },
        res.status(200).statusCode,
        "You've successfully liked this post"
      );
    } catch (error) {
      handleControllerError(error, "Failed to like post", next);
    }
  }

  public async unLikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const likes = await PostNamespace.unLikePost({ userId, postId });

      return ResponseNamespace.sendSuccessMessage(
        res,
        { likes },
        res.status(200).statusCode,
        "You've successfully unliked this post"
      );
    } catch (error) {
      handleControllerError(error, "Failed to unlike post", next);
    }
  }

  public async getPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const post = await PostNamespace.getPost(postId, userId);

      return ResponseNamespace.sendSuccessMessage(
        res,
        post,
        res.status(200).statusCode,
        "Post retrieved"
      );
    } catch (error) {
      handleControllerError(error, "Failed to retrieve post", next);
    }
  }

  public async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const visibility = req.query.visibility as string;
      const userId = req.params.userId;
      const authenticatedUserId = req.user.id;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);

      const result = await PostNamespace.queryPosts({
        filter,
        options,
        visibility,
        userId,
        authenticatedUserId
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Posts retrieved"
      );
    } catch (error) {
      handleControllerError(error, "Failed to retrieve posts", next);
    }
  }

  public async getLikedPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const filter = {};
      const options = pick(req.query, ["sortBy", "limit", "page"]);

      const result = await PostNamespace.queryLikedPosts({
        filter,
        options,
        userId
      });

      return ResponseNamespace.sendSuccessMessage(
        res,
        result,
        res.status(200).statusCode,
        "Liked posts retrieved"
      );
    } catch (error) {
      console.log("Failed to retrieve liked posts: ", error);
      handleControllerError(error, "Failed to retrieve liked posts", next);
    }
  }

  public async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      await PostNamespace.deletePost({ postId, userId });

      return ResponseNamespace.sendSuccessMessage(
        res,
        null,
        res.status(200).statusCode,
        "You've successfully deleted this post"
      );
    } catch (error) {
      console.log("Failed to delete post: ", error);
      handleControllerError(error, "Failed to delete posts", next);
    }
  }

  public async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const mediaUpload = await PostNamespace.savePostMedia(req);

      return ResponseNamespace.sendSuccessMessage(
        res,
        { mediaUpload },
        res.status(200).statusCode,
        "Post media upload successful"
      );
    } catch (error) {
      console.log("Failed to upload media: ", error);
      handleControllerError(error, "Failed to upload media: ", next);
    }
  }

  init() {
    this.router.post("/comment/initiate", this.createComment);
    this.router.post("/comment/edit", this.editComment);
    this.router.post(
      "/endorsement/initiate",
      auth,
      validate(engagementValidation.createEndorsement),
      this.createEndorsement
    );
    this.router.get(
      "/endorsement/:userId",
      auth,
      validate(engagementValidation.getEndorsements),
      this.getEndorsements
    );
    this.router.get("/followers", auth, this.getFollowers);
    this.router.get("/following", auth, this.getUsersFollowing);
    this.router.post("/follow", auth, validate(engagementValidation.followUser), this.followUser);
    this.router.post(
      "/unfollow",
      auth,
      validate(engagementValidation.unFollowUser),
      this.unFollowUser
    );
    this.router.post("/posts", auth, validate(engagementValidation.createPost), this.createPost);
    this.router.get("/posts/:postId", auth, this.getPost);
    this.router.delete("/posts/:postId", auth, this.deletePost);
    this.router.get("/posts/user/:userId", auth, this.getAllPosts);
    this.router.get("/posts/user/:userId/liked", auth, this.getLikedPosts);
    this.router.post("/posts/:postId/like", auth, this.likePost);
    this.router.post("/posts/:postId/unlike", auth, this.unLikePost);
    this.router.post("/posts/upload-media", auth, uploadPost.single("file"), this.uploadMedia);
  }
}

export default new EngagementsController().router;
