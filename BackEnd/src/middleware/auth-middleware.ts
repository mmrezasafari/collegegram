import { NextFunction, Request, Response } from "express";
import { decryptJWT } from "../../utility/jwt_utils";
import { errorResponse } from "../../utility/response";
import { AuthService } from "../modules/auth/auth.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res.status(401).json(errorResponse("احراز هویت انجام نشده است"));
    } else {
      req.user = decryptJWT(accessToken)
      next();
    }

  } catch (error) {
    res.status(401).json(errorResponse("احراز هویت انجام نشده است"));
    return;
  }
}