import { Router } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { createUserDto } from "../modules/auth/dto/create-user.dto";
import { handleExpress } from "../../utility/handle-express";
import { loginRequestDto } from "../modules/auth/dto/login-request.dto";
import { authMiddleware } from "../middleware/auth-middleware";
import { errorResponse, successResponse } from "../../utility/response";
import { HttpError } from "../../utility/http-error";

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
  return app;
}