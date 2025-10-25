import { Router } from "express";
import { LikeService } from "../modules/like/like.service";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";



export const likeRouter = (likeService: LikeService) => {
  const app = Router();

  app.post("/:id/like", (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => likeService.likePostAndCreateNotification(postId, user.userId));
  })

  app.delete("/:id/unlike", (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => likeService.unLikePost(postId, user.userId));
  })


  return app;
}