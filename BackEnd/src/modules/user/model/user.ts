export interface User {
  id: string;
  username: string;
  email: string;
  isPrivate: boolean;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imagePath?: string;
}
export interface UserWithoutEmail {
  userId: string;
  username: string
}