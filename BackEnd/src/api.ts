import express from "express";
import { DataSource } from "typeorm";
import { UserRepository } from "./modules/user/user.repository";
import { AuthService } from "./modules/auth/auth.service";
import { authRouter } from "./routes/auth.route";
import { zodErrorMiddleware } from "./middleware/zod-error.middleware";
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from "./config/swagger.config";
import { errorResponse } from "../utility/response";
import { SessionRepository } from "./modules/auth/session.repository";
import cookieParser from "cookie-parser";

export const makeApp = (dataSource: DataSource) => {

  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const userRepo = new UserRepository(dataSource);
  const sessionRepo = new SessionRepository(dataSource)
  const authService = new AuthService(userRepo, sessionRepo);

  app.use(authRouter(authService));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

  app.use((req, res) => {
    res.status(404).json(errorResponse("مسیر یافت نشد"));
  })

  app.use(zodErrorMiddleware)
  return app;
}

