import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import { updateUserDto } from "../modules/user/dto/update-user.dto";
import zod from "zod";
import { upload } from "../middleware/upload-image.middleware";

export const userRouter = (userService: UserService) => {
  const app = Router();

  app.patch("/:id", (req, res) => {
    const userId = zod.uuid().parse(req.params.id);
    const dto = updateUserDto.parse(req.body);
    handleExpress(res, () => userService.editProfile(userId, dto));
  })


  app.get("/:id", async (req, res) => {
    const userId = zod.uuid().parse(req.params.id);
    handleExpress(res, () => userService.getUser(userId));
  })


  app.post("/:id/upload",upload.single('avatar'), (req , res) =>{
    const userId = zod.uuid().parse(req.params.id);
    if (!req.file){
      res.status(400).json({message:"فایل ارسال نشده"});
      return;
    }
    handleExpress(res,() => userService.saveUserImage(req.file! , userId))
  });

  return app;
}