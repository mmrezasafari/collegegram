import { Post } from "../../post/model/post";

export type HomePageResponseDto = {
  username: string,
  firstName?: string,
  lastName?: string,
  imagePath?: string,
  followerCount: number,
  savedCount: number,
  commentCount: number,
  likeCount: number,
  post: Post, // ← آرایه از Post
}