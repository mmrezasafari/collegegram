export interface IUploadPosts {
  caption: string
  images: File[]
  mention: string
}

export interface IUploadedImage {
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
    images: IUploadedImage[]
  }
  id: string
  createdAt: string
  updatedAt: string
}

export interface IPosts {
  id: string
  caption: string
  createdAt: string
  updatedAt: string
  images: Array<IUploadedImage>
}

export interface IPostsRes {
  success: string
  data: Array<IPosts>
}

export interface IGetPostRes {
  success: boolean,
  data: {
    user: {
      username: string
      imagePath: string
    }
    post: {
      caption: string
      images: Array<IUploadedImage>
    }
    createdAt: string
  },
  mentionedUsernames: string,
  likeCount: string,
  liked: boolean,
  saveCount: string,
  saved: boolean
}
