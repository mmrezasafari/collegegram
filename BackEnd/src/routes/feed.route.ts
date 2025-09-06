import { Router } from "express";
import zod from "zod";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import { FeedService } from "../modules/feed.service";



export const feedRouter = (feedService:FeedService) => {
  const app = Router();

  app.get("/:id",(req , res) => {
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
     handleExpress(res, () => feedService.getPost(postId,user.userId));
  })

  return app;
}