import { Router } from "express";
import { UserService } from "../modules/user/user.service";
import { handleExpress } from "../../utility/handle-express";
import { errorResponse } from "../../utility/response";
import zod from "zod";
import { updateUserDto } from "../modules/user/dto/update-user.dto";
import { upload } from "../middleware/upload-image.middleware";


export const profileRouter = (userService: UserService) => {
  const app = Router();

  app.get("/me", (req, res) => {
    const user = req.user
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => userService.getUser(user.userId));
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

  app.post("/posts", upload.array('images', 10), (req, res) => {
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
    handleExpress(res, () => userService.savePost(req.files as Express.Multer.File[], caption, user.userId));
  });
  return app;
}