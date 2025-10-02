import { Router } from "express";
import { BlockService } from "../modules/block/block.service";
import { errorResponse } from "../../utility/response";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";


export const blockRouter = (blockService:BlockService) => {
  const app = Router();

  app.post("/:username/block", (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => blockService.blockUser(user.userId, username))

  })

  app.delete("/:username/unblock", (req, res) => {
    const username = zod.string().nonempty().parse(req.params.username);
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => blockService.unblockUser(user.userId, username));

  })
  app.get("/me/block", (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => blockService.getBlockList(user.userId));

  })

  return app;
}