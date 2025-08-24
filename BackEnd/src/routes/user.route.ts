import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import zod, { ZodUUID } from "zod";


export const userRouter = (userService: UserService) => {
  const app = Router();

  app.get("/:id", async (req, res) => {

    const userId = zod.uuid().parse(req.params.id);
    handleExpress(res, () => userService.getUser(userId));
  })
  return app;
}