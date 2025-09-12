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
  success: boolean
  data: {
    success: boolean
    data: {
      post: {
        id: string
        caption: string
        user: {
          id: string
          username: string
          firstName: string
          lastName: string
          email: string
          bio: string
          imagePath: string
          createAt: string
          updatedAt: string
        }
        images: IUploadedImage[]
        createdAt: string
        updatedAt: string
      }
      mentionedUsernames: Array<string>
      savedhashtags: Array<string>
    }
  }
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
  success: boolean
  data: {
    user: {
      username: string
      imagePath: string
    }
    post: {
      caption: string
      images: Array<IUploadedImage>
      createdAt: string
    }
    mentionedUsernames: Array<string>
    likeCount: string
    liked: boolean
    saveCount: string
    saved: boolean
  }
}

export interface IUpdatedPostRes {
  success: boolean
  data: [
    {
      success: boolean
      data: {
        updatedPost: {
          id: string
          caption: string
          images: Array<IUploadedImage>
          createdAt: string
          updatedAt: string
        }
        usernames: Array<string>
      }
    },
  ]
}
