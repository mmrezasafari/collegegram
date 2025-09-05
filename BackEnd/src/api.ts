import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { UserRepository } from "./modules/user/user.repository";
import { AuthService } from "./modules/auth/auth.service";
import { authRouter } from "./routes/auth.route";
import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger.config";
import { errorResponse } from "../utility/response";
import { SessionRepository } from "./modules/auth/session.repository";
import cookieParser from "cookie-parser";
import { UserService } from "./modules/user/user.service";
import { userRouter } from "./routes/user.route";
import { authMiddleware } from "./middleware/auth-middleware";
import { PostRepository } from "./modules/post/post.repository";
import { profileRouter } from "./routes/profile.route";
import { FollowRepository } from "./modules/follow/follow.repository";
import { FollowService } from "./modules/follow/follow.service";
import { followRouter } from "./routes/follow.route";
import { postRouter } from "./routes/post.route";
import { PostService } from "./modules/post/post.service";
import { likeRouter } from "./routes/like.route";
import { LikeService } from "./modules/like/like.service";
import { LikeRepository } from "./modules/like/like.repository";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; username: string };
    }
  }
}

export const makeApp = (dataSource: DataSource) => {

  const app = express();
  app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_HOST,
  }))
  app.use(express.json());
  app.use(cookieParser());

  const userRepo = new UserRepository(dataSource);
  const postRepo = new PostRepository(dataSource);
  const sessionRepo = new SessionRepository(dataSource);
  const followRepo = new FollowRepository(dataSource);
  const likeRepo = new LikeRepository(dataSource)

  const authService = new AuthService(userRepo, sessionRepo);
  const userService = new UserService(userRepo);
  const followService = new FollowService(followRepo, userService);
  const postService = new PostService(postRepo, userService);
  const likeService = new LikeService(likeRepo, postService);

  app.use(authRouter(authService));
  app.use("/users", authMiddleware, userRouter(userService, followService, postService));

  app.use("/profile", authMiddleware, profileRouter(userService, postService, followService));

  app.use("/users", authMiddleware, followRouter(followService))

  app.use("/users", authMiddleware, postRouter(postService));

  app.use("/posts", authMiddleware, likeRouter(likeService));

  setupSwagger(app);

  app.use((req, res) => {
    res.status(404).json(errorResponse("مسیر یافت نشد"));
  })

  app.use(errorMiddleware)
  return app;
}

