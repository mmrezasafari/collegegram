import { User } from "../../user/model/user";

export interface Session {
  id: string;
  authCode: string;
  expireDate: Date;
  user: User;
}