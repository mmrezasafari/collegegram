export interface UserProfile {
  id: string;
  username: string;
  email: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imagePath?: string;
  isFollowing?: boolean;
}