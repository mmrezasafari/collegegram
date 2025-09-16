export interface ITagGetRes {
  success: boolean
  data: ITagged[]
}

export interface ITagged {
  id: string
  caption: string
  images: Array<{
    id: string
    url: string
  }>
}
