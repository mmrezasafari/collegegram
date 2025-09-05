import { Router } from "express";
import { PostService } from "../modules/post/post.service";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";


export const postRouter = (postService: PostService) => {
  const app = Router();

  app.get("/:username/posts", (req, res) => {
    const username = zod.string().parse(req.params.username);
    handleExpress(res, () => postService.getPosts(username));
  })
  return app;
}