export interface ISearchUserGetRes {
  success: boolean
  data: ISearchedUsersData[]
}

export interface ISearchedUsersData {
  success: true
  data: [
    {
      id: string
      caption: string
      createdAt: string
      updatedAt: string
      images: Array<{
        id: string
        url: string
        mimeType: string
        createdAt: string
        updatedAt: string
      }>
      tags: []
    },
  ]
}

export interface ISearchTagsGetRes {
  success: boolean
  data: ISearchedTagsData[]
}

export interface ISearchedTagsData {
  id: string
  caption: string
  images: Array<{
    id: string
    url: string
  }>
}
//     id: string
//     url: string
//   }>
// }
