import { Router } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { createUserDto } from "../modules/auth/dto/create-user.dto";
import { handleExpress } from "../../utility/handle-express";
import { loginRequestDto } from "../modules/auth/dto/login-request.dto";
import { authMiddleware } from "../middleware/auth-middleware";
import { errorResponse, successResponse } from "../../utility/response";
import { HttpError } from "../../utility/http-error";
import { resetPasswordDto } from "../modules/auth/dto/reset-password.dto";
import zod from "zod";

export const authRouter = (authService: AuthService) => {
  const app = Router();

  app.post("/register", (req, res) => {
    const dto = createUserDto.parse(req.body);
    handleExpress(res, () => authService.register(dto));
  });

  app.post("/login", (req, res) => {
    const dto = loginRequestDto.parse(req.body);
    handleExpress(res, () => authService.login(dto));
  })
  app.post("/logout", authMiddleware, (req, res) => {
    const user = req.user;
    if (!user) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"))
      return;
    }
    handleExpress(res, () => {
      const response = authService.logout(user.userId);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return response;
    });
  })
  app.post("/forget-password", (req, res) => {
    const usernameOrEmail = zod.string().nonempty().parse(req.body.usernameOrEmail);
    handleExpress(res, () => authService.forgetPassword(usernameOrEmail));
  })

  app.get("/check-password-token", (req, res) => {
    const token = zod.uuid().parse(req.query.token);
    const usernameOrEmail = zod.string().nonempty().parse(req.query.usernameOrEmail);
    handleExpress(res, () => authService.checkToken(token, usernameOrEmail));
  })
  app.patch("/reset-password", (req, res) => {
    const dto = resetPasswordDto.parse(req.body);
    handleExpress(res, () => authService.resetPassword(dto));
  })
  return app;
}