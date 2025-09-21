import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { baseUrl } from '@/utils/baseUrl'
import type { ISearchTagedData, ISearchUserData } from '@/types/search'

interface UseSearchResult {
  userSuggestions: ISearchUserData[]
  tagSuggestions: ISearchTagedData[]
  loading: boolean
}

export function useSearch(
  offset: number,
  limit: number,
  order: string,
  issummary: boolean,
): UseSearchResult {
  const [userSuggestions, setUserSuggestions] = useState<ISearchUserData[]>([])
  const [tagSuggestions, setTagSuggestions] = useState<ISearchTagedData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for valid parameters before making API calls
    if (offset == null || limit == null || !order) {
      setUserSuggestions([])
      setTagSuggestions([])
      return
    }
    setLoading(true)
    const fetchUsers = axios.get(
      baseUrl(
        `search/users?offset=${offset}&limit=${limit}&sort=${order}&isSummary=${issummary}&q=$`,
      ),
    )
    const fetchTags = axios.get(
      baseUrl(
        `search/tags?offset=${offset}&limit=${limit}&sort=${order}&isSummary=true&q=$`,
      ),
    )
    Promise.all([fetchUsers, fetchTags])
      .then(([usersRes, tagsRes]) => {
        setUserSuggestions(usersRes.data?.data ?? [])
        setTagSuggestions(tagsRes.data?.data ?? [])
      })
      .catch(() => {
        setUserSuggestions([])
        setTagSuggestions([])
      })
      .finally(() => setLoading(false))
  }, [offset, limit, order, issummary])

  return { userSuggestions, tagSuggestions, loading }
}
