import { Router } from "express";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";
import { CommentService } from "../modules/comment/comment.service";


export const commentRouter = (commentService: CommentService) => {
  const app = Router();

  app.post("/:id/comment", (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    const { content, parentId } = req.body;
    if (parentId == null) {
      handleExpress(res, () => commentService.comment(postId, user.userId, content));
    }
    else {
      handleExpress(res, () => commentService.replyComment(postId, user.userId, content, parentId));
    }
  })

  app.get("/:id/comment", (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const commentId = req.query.commentId;
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    if (commentId == null) {
      handleExpress(res, () => commentService.getComments(postId, user.userId));
    }
    if (commentId) {
      if (typeof commentId === "string") {
        handleExpress(res, () => commentService.getReplies(commentId, user.userId));
      }
      else {
        res.status(400).json(errorResponse("آیدی کامنت باید استرینگ باشد"))
        return;
      }
    }
  })

  return app;
}