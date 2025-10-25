import { ImageMimeType } from "../../../../utility/image-mime-type.enum";

export interface User {
  id: string;
  username: string;
  email: string;
  isPrivate: boolean;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imagePath?: string;
  mimeType?: ImageMimeType;
}
export interface UserWithoutEmail {
  userId: string;
  username: string
}