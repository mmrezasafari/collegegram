import { Router } from "express";
import { LikeService } from "../modules/like/like.service";



export const likeRouter = (likeService:LikeService) => {
  const app = Router();

  return app;
}