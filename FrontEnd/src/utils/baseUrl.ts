export const baseUrl = (url: string) => {
  const apiUrl = import.meta.env.VITE_API_URL

  return `${apiUrl}/${url}`
}
