import type { IUser } from './user'

export interface IRegisterRes {
  success: boolean
  data: IUser
}

export interface IRegister {
  username: string
  email: string
  password: string
}
