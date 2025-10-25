import { PostImage } from "../../post/model/post-image";
import { TagEntity } from "../../tag/tag.entity";
import { User } from "../../user/model/user";

export interface SearchTag {
  id: string;
  caption?: string;
  onlyCloseFriends: boolean;
  images: PostImage[];
  user?: User;
  createdAt: Date;
  updatedAt:Date;
  tags: TagEntity[];
}