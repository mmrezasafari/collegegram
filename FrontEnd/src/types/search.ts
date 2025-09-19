export interface ISearchUserDataGetRes {
  success: boolean
  data: ISearchUserData[]
}

export interface ISearchUserData {
  id: string
  name: string
  avatar: string
}

export interface ISearchKeywordDataGetRes {
  success: boolean
  data: ISearchKeywordData[]
}

export interface ISearchKeywordData {
  id: string
  keyword: string
}

export interface ISearchSuggestionDataGetRes {
  success: boolean
  data: ISearchSuggestionData[]
}

export interface ISearchSuggestionData {
  id: string
  suggestion: string
}
