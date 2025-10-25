import { Post } from "../../post/model/post";

export type HomePageResponseDto = {
  username: string,
  firstName?: string,
  lastName?: string,
  imagePath?: string,
  followerCount: number,
  savedCount: number,
  isSaved: boolean,
  commentCount: number,
  likeCount: number,
  isLiked: boolean,
  post: Post, // ← آرایه از Post
}