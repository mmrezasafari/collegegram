import { User } from "../../user/model/user";

export interface CloseFriend {
    userId: string;
    user: User;
    friendId: string;
    friend: User;
}