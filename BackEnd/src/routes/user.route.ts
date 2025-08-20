import { Router } from "express";
import { UserService } from "../modules/user/user.service";


export const userRouter = (userService: UserService) => {
  const app = Router();
  
  

  return app;
}