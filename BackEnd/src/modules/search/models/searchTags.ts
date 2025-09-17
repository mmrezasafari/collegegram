import { PostImage } from "../../post/model/post-image";
import { TagEntity } from "../../tag/tag.entity";

export interface SearchTag {
  id: string;
  caption?: string;
  images: PostImage[];
  createdAt: Date;
  updatedAt:Date;
  tags: TagEntity[];
}