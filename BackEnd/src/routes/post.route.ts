import { Router } from "express";
import { PostService } from "../modules/post/post.service";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";
import { upload } from "../middleware/upload-image.middleware";
import { updatePostDto } from "../modules/post/dto/update-post.dto";
import { errorResponse } from "../../utility/response";


export const postRouter = (postService: PostService) => {
  const app = Router();

  app.patch("/posts/:id", upload.array('images', 10), (req, res) => {
    const postId = zod.uuid().parse(req.params.id);
    const dto = updatePostDto.parse(req.body);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    if ((!req.files || req.files.length === 0) && (!dto.imageUrls || dto.imageUrls.length === 0 || dto.imageUrls[0] === "")) {
      res.status(400).json({ message: "پست ارسال نشده است" });
      return;
    }
    handleExpress(res, () => postService.editPost(postId, user.userId, req.files as Express.Multer.File[], dto, user.userId));

  })

  return app;
}