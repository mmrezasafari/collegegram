import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { UserRepository } from "./modules/user/user.repository";
import { AuthService } from "./modules/auth/auth.service";
import { authRouter } from "./routes/auth.route";
import { errorMiddleware } from "./middleware/zod&multer-error.middleware";
import { setupSwagger } from "./config/swagger.config";
import { errorResponse } from "../utility/response";
import { SessionRepository } from "./modules/auth/session.repository";
import cookieParser from "cookie-parser";
import { UserService } from "./modules/user/user.service";
import { userRouter } from "./routes/user.route";
import { authMiddleware } from "./middleware/auth-middleware";


export const makeApp = (dataSource: DataSource) => {

  const app = express();
  app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_HOST,
  }))
  app.use(express.json());
  app.use(cookieParser());

  const userRepo = new UserRepository(dataSource);
  const sessionRepo = new SessionRepository(dataSource)
  const authService = new AuthService(userRepo, sessionRepo);
  const userService = new UserService(userRepo);

  app.use(authRouter(authService));
  app.use("/users", authMiddleware(authService), userRouter(userService));


  setupSwagger(app);

  app.use((req, res) => {
    res.status(404).json(errorResponse("مسیر یافت نشد"));
  })

  app.use(errorMiddleware)
  return app;
}

