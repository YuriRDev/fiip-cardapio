import axios from 'axios'

// https://api.menu.fiip.com.br
// 192.168.15.167:3333

const api = axios.create({
  baseURL: 'https://api.menu.fiip.com.br'
})

export default api;