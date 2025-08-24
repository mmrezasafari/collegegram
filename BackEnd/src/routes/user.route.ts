import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import { updateUserDto } from "../modules/user/dto/update-user.dto";
import zod from "zod";


export const userRouter = (userService: UserService) => {
  const app = Router();
  
  app.patch("/:id", (req, res) => {
    const userId = zod.uuid().parse(req.params.id);
    const dto = updateUserDto.parse(req.body);
    handleExpress(res, () => userService.editProfile(userId, dto));
  })
  

  return app;
}