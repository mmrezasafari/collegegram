export interface IUploadPosts {
  caption: string
  images: File[]
  mention: string
}

export interface IUploadedImages {
  url: string
  id: string
  createdAt: string
  updatedAt: string
}

export interface IPostsRes {
  success: string
  data: Array<IPost>
}

export interface IPost {
  id: string
  caption: string
  createdAt: string
  updatedAt: string
  images: Array<IUploadedImages>
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
