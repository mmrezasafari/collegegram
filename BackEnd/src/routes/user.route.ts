import { Router } from "express";
import { registerDto } from "../modules/user/dto/register.dto"
import { loginDto, LoginDto } from "../modules/user/dto/login.dto";
import { handleExpress } from "../../utility/handle-express";
import { ZodError } from "zod";
import { User } from "../modules/user/model/User";
import { UserService } from "../modules/user/user.service";

export const makeUserRouter = (userService: UserService) => {
  const app = Router();
//   app.post("/login", (req, res) => {
//     const dto = loginDto.parse(req.body);
//     handleExpress<User>(res, () => userService.login(dto));
//   });
  app.post("/register", (req, res) => {
    const dto = registerDto.parse(req.body);
    handleExpress<User | null>(res, () => userService.register(dto));
  });

  app.post("/login", (req, res)=>{
    const dto = loginDto.parse(req.body);
    handleExpress<User | null>(res, () => userService.login(dto));
  })
  return app;
}