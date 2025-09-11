export interface IExplore {
  username: string
  firstName: string
  lastName: string
  imagePath: string
  post: {
    id: string
    caption: string
    images: Array<{
      id: string
      url: string
      createAt: string
      updateAt: string
    }>
  }
  followerCount: number
  likeCount: number
  savedCount: number
  commentCount: number
  liked: boolean
  saved: boolean
}

export interface IExploreGetRes {
  data: Array<IExplore>
  success: string
}
