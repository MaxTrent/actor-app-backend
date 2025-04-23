import CommentModel, { IComment } from "./models/comment";

export class CommentNamespace {
  public static async createNewComment(userDetails: { comment: String }): Promise<IComment> {
    const { comment } = userDetails;
    if (!comment || comment.trim().length === 0) {
      throw new Error("You have to write a comment");
    }

    const newComment = await CommentModel.create({
      comment: comment,
      likes: 0,
      replies: []
    });
    return newComment;
  }

  public static async editComment(userDetails: {
    comment: String;
    alteredComment: String;
  }): Promise<IComment> {
    const { comment, alteredComment } = userDetails;

    const existingComment = await CommentModel.findOne({ comment: comment });
    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (!alteredComment || alteredComment.trim().length === 0) {
      throw new Error("Altered comment cannot be empty");
    }

    const editedComment = await CommentModel.findOneAndUpdate(
      { comment: comment },
      { comment: alteredComment }
    );
    return editedComment;
  }
}
