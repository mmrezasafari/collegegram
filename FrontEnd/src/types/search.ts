export interface ISearchedUsersData {
  username: string
  firstName: string
  lastName: string
  imagePath: string
  mimeType: string
  followersCount: number
  isFollowing: boolean
}

export interface ISearchUserGetRes {
  data: Array<ISearchedUsersData>
  success: boolean
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
