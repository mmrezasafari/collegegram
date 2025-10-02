import { User } from "../../user/model/user";

export interface PasswordToken {
  token: string;
  expireDate: Date;
  user: User;
}