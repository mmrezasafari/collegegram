import { Router } from "express";
import { CloseFriendService } from "../modules/closeFriend/close-friend.service";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";


export const closeFriendRouter = (closeFriendService:CloseFriendService) => {
  const app = Router();

  app.post("/:username/close-friends", (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => closeFriendService.addCloseFriend(user.userId, username));

  })

  app.delete("/:username/close-friends", (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => closeFriendService.removeCloseFriend(user.userId, username));

  })

  app.get("/me/close-friends", (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => closeFriendService.getCloseFriends(user.userId));

  })

  return app;
}