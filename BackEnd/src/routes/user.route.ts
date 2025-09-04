import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import zod from "zod";

export const userRouter = (userService: UserService) => {
  const app = Router();

  app.get("/:username", async (req, res) => {
    const username = zod.string().parse(req.params.username);
    handleExpress(res, () => userService.getUserByUsername(username));
  })

  return app;
}