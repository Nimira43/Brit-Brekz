import axios from 'axios'
import Swal from 'sweetalert2'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true,
  headers: {
    'Content-type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },

  (error) => {
    if (error.response || error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Alert!',
        text: 'Session timed out, please login again',
        customClass: { confirmButton: 'main-btn' }
      })
      localStorage.removeItem('auth')

      setTimeout(() => {
        location.href = '/login'
      }, 3000)
    }
    return Promise.reject(error)
  }  
)

export default apiClient

