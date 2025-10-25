import { Router } from "express";
import { LikeCommentService } from "../modules/likeComment/likeComment.service";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";



export const likeCommentRouter = (likeCommentService:LikeCommentService) => {
  const app = Router();

  app.post("/:id/like",(req, res) =>{
    const commentId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
          res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
          return;
        }
    handleExpress(res, () => likeCommentService.likeComment(commentId,user.userId));
  })

  app.delete("/:id/unlike",(req, res) =>{
    const commentId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
          res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
          return;
        }
    handleExpress(res, () => likeCommentService.unLikeComment(commentId,user.userId));
  })


  return app;
}