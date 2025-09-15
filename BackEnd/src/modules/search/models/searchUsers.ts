export interface SearchUserByDetails {
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  followersCount: number;
  isFollowing: boolean;
}

export interface SearchUserBySummary {
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
}