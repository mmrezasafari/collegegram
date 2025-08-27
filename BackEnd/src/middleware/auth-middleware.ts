import { NextFunction, Request, Response } from "express";
import { encryptJWT } from "../../utility/jwt_utils";
import { errorResponse } from "../../utility/response";
import { AuthService } from "../modules/auth/auth.service";

export const authMiddleware =
  (authService: AuthService) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {

        const refreshToken = req.cookies.refreshToken;
        const session = await authService.getSessionByToken(refreshToken);
        if (session && session.expireDate < new Date()) {
          res.status(401).json(errorResponse("توکن منقضی شده است"));
          return;
        }
        if (!session) {
          res.status(401).json(errorResponse("توکن نامعتبر است"));
          return;
        }
        const accToken = encryptJWT(session.user.id, session.user.username, process.env.JWT_SECRET ?? "", "15m");
        res.cookie("accessToken", accToken);
        res.cookie("refreshToken", req.cookies.refreshToken);
      }
      next();
    } catch (error) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"));
      return;
    }
  }