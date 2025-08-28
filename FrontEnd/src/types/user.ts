export interface IUser {
  username: string
  email: string
  id: string
  createdAt: string
  updatedAt: string
}

export interface IRegisteredUser {
  success: boolean
  data: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    bio: string
    imagePath: string
    createdAt: string
    updatedAt: string
  }
}