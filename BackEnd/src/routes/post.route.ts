import { Router } from "express";
import { PostService } from "../modules/post/post.service";


export const postRouter = (postService:PostService) => {
  const app = Router();

  return app;
}