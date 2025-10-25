import { ImageMimeType } from "../../../../utility/image-mime-type.enum";
import { Post } from "./post";

export interface PostImage {
  id: string;
  url: string;
  mimeType: ImageMimeType,
  post: Post;
}