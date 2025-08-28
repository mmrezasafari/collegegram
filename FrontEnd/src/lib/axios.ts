import axios from 'axios'

const api = axios.create({
  baseURL: 'http://37.32.12.131',
  withCredentials: true,
})

export default api
