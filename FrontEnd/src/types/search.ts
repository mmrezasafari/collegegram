// export interface ISearchUserDataGetRes {
//   success: boolean
//   data: ISearchUserData[]
// }

export interface ISearchUserData {
  success: boolean
  data: {
    username: string
    firstName: string
    lastName: string
    imagePath: string
    isSummary: boolean
  }[]
}

export interface ISearchTagedData {
  success: true
  data: [
    {
      id: string
      caption: string
      createdAt: string
      updatedAt: string
      images: [
        {
          id: string
          url: string
          mimeType: string
          createdAt: string
          updatedAt: string
        },
      ]
      tags: []
    },
  ]
}

// export interface ISearchUserData {
//   id: string
//   name: string
//   avatar: string
// }

// export interface ISearchTagedDataGetRes {
//   success: boolean
//   data: ISearchTagedData[]
// }

// export interface ISearchTagedData {
//   id: string
//   keyword: string
// }

export interface ISearchSuggestionDataGetRes {
  success: boolean
  data: ISearchSuggestionData[]
}

export interface ISearchSuggestionData {
  id: string
  suggestion: string
}
