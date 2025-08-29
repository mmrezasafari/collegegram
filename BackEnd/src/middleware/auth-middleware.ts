import { NextFunction, Request, Response } from "express";
import { encryptJWT, decryptJWT } from "../../utility/jwt_utils";
import { errorResponse } from "../../utility/response";
import { AuthService } from "../modules/auth/auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string };
    }
  }
}

export const authMiddleware =
  (authService: AuthService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let accessToken = req.cookies.accessToken;

      if (!accessToken) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json(errorResponse("هیچ توکنی ارسال نشده است"));
        }

        const session = await authService.getSessionByToken(refreshToken);
        if (!session) {
          return res.status(401).json(errorResponse("توکن نامعتبر است"));
        }
        if (session.expireDate < new Date()) {
          return res.status(401).json(errorResponse("توکن منقضی شده است"));
        }

        accessToken = encryptJWT(
          { id: session.user.id, username: session.user.username, email:session.user.email },
          process.env.JWT_SECRET ?? "",
          "15m"
        );

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
      }

      const payload = decryptJWT(accessToken) as {
        id: string;
        username: string;
      };

      req.user = { id: payload.id, username: payload.username };

      next();
    } catch (error) {
      console.error("AuthMiddleware error:", error);
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"));
    }
  };
