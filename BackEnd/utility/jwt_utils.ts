import jwt from "jsonwebtoken";
import { UserWithoutEmail } from "../src/modules/user/model/user";

export const encryptJWT = (userId: string, username: string, secret: jwt.Secret, expiresIn: jwt.SignOptions["expiresIn"]): string => {
  const token = jwt.sign({ userId, username }, secret, { expiresIn: expiresIn });
  return token;
}

export const decryptJWT = (token: string): UserWithoutEmail => {
  const payload = (jwt.verify(token, process.env.JWT_SECRET ?? "")) as UserWithoutEmail & { iat: number };
  return {
    userId: payload.userId,
    username: payload.username
  }
}