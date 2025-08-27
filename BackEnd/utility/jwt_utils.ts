import jwt from "jsonwebtoken";
import { User } from "../src/modules/user/model/user";

export const encryptJWT = (userId: string, username: string, secret: jwt.Secret, expiresIn: jwt.SignOptions["expiresIn"]): string => {
  const token = jwt.sign({ userId, username }, secret, { expiresIn: expiresIn });
  return token;
}

export const decryptJWT = (token: string): User => {
  const payload = (jwt.verify(token, process.env.JWT_SECRET ?? "")) as User & { iat: number };
  return {
    id: payload.id,
    username: payload.username,
    email: payload.email
  }
}