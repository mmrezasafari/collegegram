export interface IErrorRes {
  success: boolean
  message: string
}

export interface ISuccessRes {
  success: boolean
  data: {
    message: string
  }
}
