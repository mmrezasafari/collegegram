import express, { ErrorRequestHandler } from 'express';
import { DataSource } from 'typeorm';
import { ZodError } from 'zod';
import { makeUserRouter } from './routes/user.route';
import { UserRepo } from './modules/user/uers.repository';
import { UserService } from './modules/user/user.service';

export const makeApp = (datasource: DataSource) => {
  const app = express();
  app.use(express.json());

//   if (process.env.NODE_ENV !== "test") {
//     app.use((req, res, next) => {
//       console.log(req.method, req.url);
//     })
//   }


  const userRepo = new UserRepo();
  const userService = new UserService(userRepo);

  app.use(makeUserRouter(userService));


  app.use((req, res) => {
    res.status(404).send({ Message: "Not Found" });
  })
  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
      res.status(400).send({ message: error.message });
    }
    res.status(500).send();
  }
  app.use(errorHandler);
  return app;
}