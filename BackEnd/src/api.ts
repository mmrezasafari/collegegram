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
import { saveRouter } from "./routes/save.route";
import { SaveService } from "./modules/savedPost/saved-post.service";
import { SaveRepository } from "./modules/savedPost/saved-post.repository";
import { MentionService } from "./modules/mention/mention.service";
import { MentionRepository } from "./modules/mention/mention.repository";
import { feedRouter } from "./routes/feed.route";
import { FeedService } from "./modules/feed.service";
import { HashtagService } from "./modules/tag/tag.service";
import { HashtagRepository } from "./modules/tag/tag.repository";
import path from "path";
import { SearchService } from "./modules/search/search.service";
import { searchRouter } from "./routes/search.route";
import { commentRouter } from "./routes/comment.route";
import { CommentRepository } from "./modules/comment/comment.repository";
import { CommentService } from "./modules/comment/comment.service";

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
  app.use('/BackEnd/public', express.static(path.join(__dirname, '..', 'public')))
  app.use(cookieParser());

  const userRepo = new UserRepository(dataSource);
  const postRepo = new PostRepository(dataSource);
  const sessionRepo = new SessionRepository(dataSource);
  const followRepo = new FollowRepository(dataSource);
  const likeRepo = new LikeRepository(dataSource)
  const saveRepo = new SaveRepository(dataSource)
  const mentionRepo = new MentionRepository(dataSource)
  const hashtagRepo = new HashtagRepository(dataSource);
  const commentRepo = new CommentRepository(dataSource)

  const authService = new AuthService(userRepo, sessionRepo);
  const userService = new UserService(userRepo);
  const mentionService = new MentionService(mentionRepo, userService);
  const hashtagService = new HashtagService(hashtagRepo, userService);
  const postService = new PostService(postRepo, userService, mentionService, hashtagService);
  const likeService = new LikeService(likeRepo, postService);
  const saveService = new SaveService(saveRepo, postService);
  const followService = new FollowService(followRepo, postService, userService, likeService, saveService);
  const commentService = new CommentService(commentRepo, postService, userService)
  const feedService = new FeedService(userService, postService, mentionService, likeService, saveService, commentService);
  const searchService = new SearchService(userService, hashtagService);


  setupSwagger(app);

  app.use(authRouter(authService));
  app.use("/users", authMiddleware, userRouter(userService, followService, postService));

  app.use("/profile", authMiddleware, profileRouter(userService, postService, followService, mentionService, saveService));

  app.use("/users", authMiddleware, followRouter(followService))

  app.use("", authMiddleware, postRouter(postService));

  app.use("/posts", authMiddleware, likeRouter(likeService));

  app.use("/posts", authMiddleware, saveRouter(saveService));

  app.use("/posts", authMiddleware, feedRouter(feedService));
  
  app.use("/search", authMiddleware, searchRouter(searchService));

  app.use("/posts", authMiddleware, commentRouter(commentService));



  app.use((req, res) => {
    res.status(404).json(errorResponse("مسیر یافت نشد"));
  })

  app.use(errorMiddleware)
  return app;
}

