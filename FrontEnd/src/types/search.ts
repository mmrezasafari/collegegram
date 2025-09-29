export interface ISearchUserGetRes {
  success: boolean
  data: Array<ISearchedUsersData>
}

export interface ISearchedUsersData {
  username: string
  firstName: string
  lastName: string
  imagePath: string
  mimeType: string
  followerCount: number
  isFollowing: boolean
}

export interface ISearchTagsGetRes {
  success: boolean
  data: Array<ISearchTagsData>
}

export interface ISearchTagsData {
  id: string
  caption: string
  images: Array<{
    id: string
    url: string
  }>
}
