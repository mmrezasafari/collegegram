import { Request, Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { updateUserDto } from "../modules/user/dto/update-user.dto";
import { upload } from "../middleware/upload-image.middleware";
import { PostService } from "../modules/post/post.service";
import { FollowService } from "../modules/follow/follow.service";
import { MentionService } from "../modules/mention/mention.service";


export const profileRouter = (userService: UserService, postService: PostService, followService: FollowService, mentionService: MentionService) => {
  const app = Router();

  app.get("/me", (req, res) => {
    const me = req.user
    if (!me) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, async () => {
      const user = await userService.getUser(me.userId);
      const followerCount = await followService.countFollow(me.userId, "followers") ?? 0;
      const followingCount = await followService.countFollow(me.userId, "followings") ?? 0;
      const postCount = await postService.countPost(me.userId);
      return {
        followerCount,
        followingCount,
        postCount,
        ...user,
      }

    });
  });

  app.patch("/me", (req, res) => {
    const dto = updateUserDto.parse(req.body);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => userService.editProfile(user.userId, dto));
  });

  app.post("/image", upload.single('avatar'), (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    if (!req.file) {
      res.status(400).json({ message: "فایل ارسال نشده" });
      return;
    }
    handleExpress(res, () => userService.saveProfileImage(req.file!, user.userId))
  });

  app.post("/posts", upload.array('images', 10), (req: Request, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    if (!req.files) {
      res.status(400).json({ message: "فایل ارسال نشده" });
      return;
    }
    const caption = req.body.caption;
    const mention = req.body.mention;
    handleExpress(res, () => postService.savePost(req.files as Express.Multer.File[], caption, user.userId, mention));
  });
  app.get("/home-page", (req, res) => {
    const offset = zod.number().parse(Number(req.query.offset));
    const limit = zod.int().parse(Number(req.query.limit));
    const sort = zod.enum(["ASC", "DESC"]).parse(req.query.sort);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => followService.getHomePage(user.userId, offset, limit, sort));
  });

  app.get("/mention-page", (req, res) => {
    const offset = zod.number().parse(Number(req.query.offset));
    const limit = zod.int().parse(Number(req.query.limit));
    const sort = zod.enum(["ASC", "DESC"]).parse(req.query.sort);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => mentionService.getMentionPage(user.userId, offset, limit, sort));
  });

  return app;
}