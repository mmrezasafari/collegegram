export interface IUploadPosts {
  caption: string
  images: File[]
  mention: string
  onlyCloseFriends: boolean
}

export interface IUpdatedPosts {
  caption: string
  images: File[]
  mention: string
  onlyCloseFriends: boolean
}

export interface IUploadedImage {
  url: string
  id: string
  createdAt: string
  updatedAt: string
  mimType: string
  fileName: string
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
  onlyCloseFriends: boolean
  images: Array<IUploadedImage>
}

export interface IPostsRes {
  success: string
  data: Array<IPosts>
}

export interface IGetPostRes {
  success: boolean
  data: {
    post: {
      caption: string
      images: Array<IUploadedImage>
      profileImage: string
      username: string
      createdAt: string
      firstName: string
      lastName: string
      onlyCloseFriend: boolean
    }
    commentCount: number
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
