import Post from "lib/engagements/models/post";
import { UserProfileNamespace } from "lib/profile/userProfile";

export class TimelineNamespace {
  public static async getPosts() {
    const posts = await Post.paginate(
      { visibility: "public", media_upload: { $ne: null } },
      { populate: "media_upload", sortBy: "posted_at:desc" }
    );

    const results = await UserProfileNamespace.addUserProfile(posts);

    posts.results = results;

    return posts;
  }
}
