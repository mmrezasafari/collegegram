import { Router } from "express";
import { FollowService } from "../modules/follow/follow.service";
import zod from "zod";
import { handleExpress } from "../../utility/handle-express";
import { errorResponse } from "../../utility/response";

export const followRouter = (followService: FollowService) => {
  const app = Router();
  app.post("/:username/follow", async (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    if (user.username === username) {
      res.status(400).json(errorResponse("درخواست شما اشتباه است"))
      return;
    }
    handleExpress(res, () => followService.followUserAndCreateNotification(user.userId, username))
  })

  app.delete("/:username/unfollow", async (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);

    const user = req.user;
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => followService.unfollowUser(user.userId, username))
  })

  app.get("/:username/followers", async (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    const username = zod.string().nonempty().parse(req.params.username);
    handleExpress(res, () => followService.getFollowers(user.userId, username))
  });

  app.get("/:username/followings", async (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    const username = zod.string().nonempty().parse(req.params.username);
    handleExpress(res, () => followService.getFollowings(user.userId, username))
  })
  app.get("/:username/status", async (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    const username = zod.string().nonempty().parse(req.params.username);
    handleExpress(res, () => followService.getStatusFollowRequest(user.userId, username))
  })
  app.post("/:username/respond", async (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const accept = zod.coerce.boolean().parse(req.body.accept);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => followService.respondToFollowRequestsAndCreateNotification(user.userId, username, accept))
  })

  return app;
}