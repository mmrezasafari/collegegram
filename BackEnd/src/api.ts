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
import { SearchService } from "./modules/search/search.service";
import { searchRouter } from "./routes/search.route";
import { commentRouter } from "./routes/comment.route";
import { CommentRepository } from "./modules/comment/comment.repository";
import { CommentService } from "./modules/comment/comment.service";
import { LikeCommentRepository } from "./modules/likeComment/likeComment.repository";
import { likeCommentRouter } from "./routes/likeComment.route";
import { LikeCommentService } from "./modules/likeComment/likeComment.service";
import { CloseFriendRepository } from "./modules/closeFriend/close-friend.repository";
import { CloseFriendService } from "./modules/closeFriend/close-friend.service";
import { closeFriendRouter } from "./routes/closeFriend.route";
import { NotificationRepository } from "./modules/notification/notification.repository";
import { NotificationService } from "./modules/notification/notification.service";
import { MailService } from "./modules/auth/mail.service";
import { notificationRouter } from "./routes/notification.route";
import { PasswordTokenRepository } from "./modules/auth/password-token.repository";
import { BlockRepository } from "./modules/block/block.repository";
import { BlockService } from "./modules/block/block.service";
import { blockRouter } from "./routes/block.route";
import { GetNotificationService } from "./modules/notification/get-notification.service";

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
  const saveRepo = new SaveRepository(dataSource)
  const mentionRepo = new MentionRepository(dataSource)
  const hashtagRepo = new HashtagRepository(dataSource);
  const commentRepo = new CommentRepository(dataSource)
  const likeCommentRepo = new LikeCommentRepository(dataSource);
  const closeFriendRepo = new CloseFriendRepository(dataSource);
  const notificationRepo = new NotificationRepository(dataSource);
  const passwordTokenRepo = new PasswordTokenRepository(dataSource);
  const blockRepo = new BlockRepository(dataSource);
  const mailService = new MailService();
  const authService = new AuthService(userRepo, sessionRepo, mailService, passwordTokenRepo);
  const userService = new UserService(userRepo);
  const notificationService = new NotificationService(notificationRepo)
  const hashtagService = new HashtagService(hashtagRepo);
  const followService = new FollowService(followRepo, userService, notificationService);
  const closeFriendService = new CloseFriendService(closeFriendRepo, userService, followService);
  const mentionService = new MentionService(mentionRepo, closeFriendService, notificationService, userService);
  const postService = new PostService(postRepo, userService, mentionService, hashtagService, closeFriendService);
  const likeService = new LikeService(likeRepo, postService, notificationService);
  const saveService = new SaveService(saveRepo, postService, closeFriendService, userService);
  const commentService = new CommentService(commentRepo, postService, userService, notificationService);
  const likeCommentService = new LikeCommentService(likeCommentRepo, commentService);
  const searchService = new SearchService(userService, hashtagService, closeFriendService);
  const getNotificationService = new GetNotificationService(userService, closeFriendService, followService, notificationService)
  const feedService = new FeedService(userService, postService, mentionService, likeService, saveService, commentService, closeFriendService, followService);


  commentService.setLikeComment(likeCommentService);
  userService.setFollowService(followService);
  const blockService = new BlockService(blockRepo, userService, followService, commentService);

  commentService.setLikeComment(likeCommentService);
  userService.setFollowService(followService);
  userService.setBlockService(blockService);
  followService.setBlockService(blockService);

  setupSwagger(app);

  app.use(authRouter(authService));
  app.use("/users", authMiddleware, userRouter(userService, followService, postService, blockService));

  app.use("/profile", authMiddleware, profileRouter(userService, postService, followService, mentionService, saveService));

  app.use("/users", authMiddleware, followRouter(followService))

  app.use("", authMiddleware, postRouter(postService));

  app.use("/posts", authMiddleware, likeRouter(likeService));

  app.use("/posts", authMiddleware, saveRouter(saveService));

  app.use("", authMiddleware, feedRouter(feedService));

  app.use("/search", authMiddleware, searchRouter(searchService));

  app.use("/posts", authMiddleware, commentRouter(commentService));

  app.use("/comments", authMiddleware, likeCommentRouter(likeCommentService));

  app.use("/users", authMiddleware, closeFriendRouter(closeFriendService));

  app.use("/notifications", authMiddleware, notificationRouter(notificationService, getNotificationService));

  app.use("/users", authMiddleware, closeFriendRouter(closeFriendService))
  
  app.use("/users", authMiddleware, blockRouter(blockService))

  app.use((req, res) => {
    res.status(404).json(errorResponse("مسیر یافت نشد"));
  })

  app.use(errorMiddleware)
  return app;
}

