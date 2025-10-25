import { ImageMimeType } from "../../../../utility/image-mime-type.enum";

export interface SearchUserByDetails {
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  mimeType: ImageMimeType;
  followersCount: number;
  isFollowing: boolean;
}

export interface SearchUserBySummary {
  username: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  mimeType: ImageMimeType;
}