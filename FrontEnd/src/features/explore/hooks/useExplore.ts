import { useEffect, useState } from 'react'

export function useExplore() {
  const [followers, setFollowers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3000/profile/home-page?sort=ASC')
      .then((res) => res.json())
      .then((data) => {
        setFollowers(Array.isArray(data?.followers) ? data.followers : [])
      })
      .catch(() => setFollowers([]))
      .finally(() => setLoading(false))
  }, [])

  return { followers, loading }
}
