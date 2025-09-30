export interface IProfileEditForm {
  lastName?: string
  firstName?: string
  email?: string
  password?: string
  bio?: string
  isPrivate?: boolean
}

export interface IProfileImagesRes {
  success: boolean
  data: {
    destination: string
    encoding: string
    filedname: string
    filename: string
    mimetype: string
    orginalname: string
    path: string
    size: number
  }
}
