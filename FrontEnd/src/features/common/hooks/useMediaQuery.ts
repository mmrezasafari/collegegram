import { useEffect, useState } from 'react'

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }

    return false
  })

  useEffect(() => {
    const matchQueryList = window.matchMedia(query)

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    matchQueryList.addEventListener('change', handleChange)

    return () => matchQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export { useMediaQuery }
