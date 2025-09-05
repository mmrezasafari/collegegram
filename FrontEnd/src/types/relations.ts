export interface IFollower {
  id: string
  username: string
  imageUrl: string
  followerCount: number
}

export interface IFollowing {
  id: string
  username: string
  imageUrl: string
  followerCount: number
}

export interface IFollowersListRes {
  success: boolean
  data: Array<IFollower>
}

export interface IFollowingsListRes {
  success: boolean
  data: Array<IFollower>
}

export interface IFollowRes {
  success: boolean
  data: string
}

export interface IUnfollowRes {
  success: boolean
  data: string
}
