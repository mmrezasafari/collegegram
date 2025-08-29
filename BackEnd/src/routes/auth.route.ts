import { Router } from "express";
import { AuthService } from "../modules/auth/auth.service";
import { createUserDto } from "../modules/auth/dto/create-user.dto";
import { handleExpress } from "../../utility/handle-express";
import { loginRequestDto } from "../modules/auth/dto/login-request.dto";
import { authMiddleware } from "../middleware/auth-middleware";

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

  app.get("/me", authMiddleware(authService), (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "احراز هویت انجام نشده است" });
    }
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
  });
  return app;
}