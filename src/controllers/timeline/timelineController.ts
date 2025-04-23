import { NextFunction, Request, Response, Router } from "express";
import ResponseNamespace from "../../lib/utils/responses_namespace";
import { auth } from "middlewares/auth";
import { handleControllerError } from "lib/utils/error";
import { TimelineNamespace } from "lib/timeline/timeline";

class TimelineController {
  router: Router;
  constructor() {
    this.router = Router();
    this.init();
  }

  public async getUserTimelinePosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await TimelineNamespace.getPosts();

      return ResponseNamespace.sendSuccessMessage(res, posts, 200, "Timeline posts retrieved");
    } catch (error) {
      console.log("Error getting user's timeline posts: ", error);
      handleControllerError(error, "Error getting user's timeline posts", next);
    }
  }

  init() {
    this.router.get("/posts", auth, this.getUserTimelinePosts);
  }
}

export default new TimelineController().router;
