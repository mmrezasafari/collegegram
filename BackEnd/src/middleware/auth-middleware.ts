import { NextFunction, Request, Response } from "express";
import { decryptJWT } from "../../utility/jwt_utils";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {

  }
  const user = decryptJWT(token)
}