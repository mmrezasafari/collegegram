import { Router } from "express";
import { SaveService } from "../modules/savedPost/saved-post.service";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";



export const saveRouter = (saveService:SaveService) => {
  const app = Router();

  app.post("/:id/saved-post",(req, res) =>{
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
          res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
          return;
        }
    handleExpress(res, () => saveService.savePost(postId,user.userId));
  })

  app.delete("/:id/unsaved-post",(req, res) =>{
    const postId = zod.uuid().parse(req.params.id);
    const user = req.user
    if (!user) {
          res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
          return;
        }
    handleExpress(res, () => saveService.unSavePost(postId,user.userId));
  })


  return app;
}
