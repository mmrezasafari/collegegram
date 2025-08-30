import { User } from "../../user/model/user";

export interface Post{
    id: string;
    caption?: string;
    owner: User;
    images: string[];
}