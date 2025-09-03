export interface IUploadPosts {
  caption: string
  images: File[]
}

export interface IUploadedImages {
  url: string
  id: string
  createdAt: string
  updatedAt: string
}

export interface IUploadedPostsRes {
  success: string
  data: {
    caption: string
    user: {
      id: string
    }
    images: IUploadedImages[]
  }
  id: string
  createdAt: string
  updatedAt: string
}
