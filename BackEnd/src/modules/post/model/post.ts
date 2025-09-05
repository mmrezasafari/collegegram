import { User } from "../../user/model/user";
import { PostImage } from "./post-image";

export interface Post {
  id: string;
  caption?: string;
  user?: User;
  images: PostImage[];
  createdAt: Date;
}