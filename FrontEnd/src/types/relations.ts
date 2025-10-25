export interface IFollower {
  id: string
  username: string
  imageUrl: string
  followerCount: number
  firstName: string
  lastName: string
}

export interface IFollowing {
  id: string
  username: string
  imageUrl: string
  followerCount: number
  firstName: string
  lastName: string
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

export interface IRemoveFollowerRes {
  success: boolean
  data: string
}

export interface ICloseFriend {
  id: string
  username: string
  firstName: string
  lastName: string
  imageUrl: string
  followersCount: number
}

export interface IBlockList {
  id: string
  username: string
  firstName: string
  lastName: string
  imageUrl: string
  followersCount: number
}

export interface ICloseFriendsListRes {
  success: boolean
  data: Array<ICloseFriend>
}

export interface IBlockListRes {
  success: boolean
  data: Array<IBlockList>
}

export interface IAddCloseFriendRes {
  success: boolean
  data: string
}

export interface IRemoveCloseFriendRes {
  success: boolean
  data: string
}

export interface IBlockUserRes {
  success: boolean
  data: string
}

export interface IUnblockUserRes {
  success: boolean
  data: string
}

export interface IBlockedUserData {
  id: string
  username: string
  profilePicture: string
  followerCount: number
  firstname: string
  lastname: string
}

export interface IBlockedUsersListRes {
  success: boolean
  data: Array<IBlockedUserData>
}

export type TStatus = 'ACCEPTED' | 'PENDING' | 'NONE'

export interface IStatusRes {
  success: boolean
  data: {
    status: TStatus
  }
}
