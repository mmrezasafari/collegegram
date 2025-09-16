export interface ISavedGetRes {
  success: boolean
  data: ISaved[]
}

export interface ISaved {
  id: string
  caption: string
  images: Array<{
    id: string
    url: string
  }>
}
