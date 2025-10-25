import { User } from "../../user/model/user";

export interface Session {
  id: string;
  token: string;
  expireDate: Date;
  user: User;
}