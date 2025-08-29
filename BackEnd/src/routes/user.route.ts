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


  app.post("/:id/uploadProfile",upload.single('avatar'), (req , res) =>{
    const userId = zod.uuid().parse(req.params.id);
    if (!req.file){
      res.status(400).json({message:"فایل ارسال نشده"});
      return;
    }
    handleExpress(res,() => userService.saveProfileImage(req.file! , userId))
  });

  app.post("/:id/uploadPost",upload.array('avatar', 10), (req , res) =>{
    const userId = zod.uuid().parse(req.params.id);
    if (!req.files){
      res.status(400).json({message:"فایل ارسال نشده"});
      return;
    }
    const caption = req.body;

    // console.log("UserId:", userId);
    // console.log("Files:", req.files);
    // console.log("Caption:", req.body.caption);
    // console.log(req)

    ////???????
    // if(Array.isArray(req.files) && req.files!== undefined) {
    // handleExpress(res,() => userService.savePost(req.files, caption, userId))
    // }
    // else{
    //   const avatarFiles = req.files["avatar"];
    //   handleExpress(res,() => userService.savePost(avatarFiles, caption, userId))
    // }

    handleExpress(res, () => userService.savePost(req.files as Express.Multer.File[], caption, userId));


  });

  return app;
}