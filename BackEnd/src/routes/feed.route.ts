import { Router } from "express";
import zod from "zod";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import { FeedService } from "../modules/feed.service";



export const feedRouter = (feedService: FeedService) => {
  const app = Router();

  app.get("/posts/:id", (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => feedService.getPost(postId, user.userId));
  })

  app.get("/users/:username/posts", (req, res) => {
    const username = zod.string().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => feedService.getPosts(username, user.userId));
  })

  app.get("/profile/home-page", (req, res) => {
      const offset = zod.number().parse(Number(req.query.offset));
      const limit = zod.int().parse(Number(req.query.limit));
      const sort = zod.enum(["ASC", "DESC"]).parse(req.query.sort);
      const user = req.user
      if (!user) {
        res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
        return;
      }
      handleExpress(res, () => feedService.getHomePage(user.userId, offset, limit, sort));
    });

  return app;
}