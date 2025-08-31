import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import { updateUserDto } from "../modules/user/dto/update-user.dto";
import zod from "zod";
import { upload } from "../middleware/upload-image.middleware";

export const userRouter = (userService: UserService) => {
  const app = Router();

  app.get("/:id", async (req, res) => {
    const userId = zod.uuid().parse(req.params.id);
    handleExpress(res, () => userService.getUser(userId));
  })

  app.get("/:id/posts", (req, res) => {
    const userId = zod.uuid().parse(req.params.id);
    handleExpress(res, () => userService.getPosts(userId));
  })

  return app;
}