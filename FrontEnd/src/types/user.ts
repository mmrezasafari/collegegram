export interface IRegisteredUser {
  success: boolean
  data: IUser
}

export interface IUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  imagePath: string
  createdAt: string
  updatedAt: string
  followerCount: number
  followingCount: number
  postCount: number
  isFollowing?: boolean
}
