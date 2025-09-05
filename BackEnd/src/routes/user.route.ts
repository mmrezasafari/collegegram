import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";
import { errorResponse } from "../../utility/response";
import { FollowService } from "../modules/follow/follow.service";
import { PostService } from "../modules/post/post.service";

export const userRouter = (userService: UserService, followService: FollowService, postService: PostService) => {
  const app = Router();

  app.get("/:username", async (req, res) => {
    const username = zod.string().parse(req.params.username);
    const me = req.user;
    if (!me) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, async () => {
      const user = await userService.getUserByUsername(username);
      const followerCount = await followService.countFollow(user.id, "followers") ?? 0;
      const followingCount = await followService.countFollow(user.id, "followings") ?? 0;
      const postCount = await postService.countPost(user.id);
      const isFollowing = await followService.isFollowing(me.userId, user.id) ? true : false;
      return {
        followerCount,
        followingCount,
        postCount,
        isFollowing,
        ...user,
      }
    });
  });

  return app;
}