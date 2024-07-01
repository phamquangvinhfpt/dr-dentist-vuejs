import axios from 'axios'
import JwtService from '@services/jwt.service'
import { useAuthStore } from '@/stores/modules/auth.module'
import { useToast } from 'vuestic-ui'
import router from '@/router'

class ApiService {
  private api_url =  import.meta.env.VITE_APP_BASE_URL as string

  public axios = axios.create({
    baseURL: this.api_url,
    headers: {
      'x-from-host': location.host,
    },
  })

  constructor() {
    this.axios.interceptors.request.use(
      async function (config) {
        if (config.url !== '/refresh-token' && config.url !== '/tokens') {
          // config.headers.Authorization = JwtService.getAuthHeader()
          console.log('c')
          const tokenExpiryTime = JwtService.getTokenExpiryTime()
          console.log('tokenExpiryTime', tokenExpiryTime)
          const token = JwtService.getToken()

          if (tokenExpiryTime && token) {
            // convert milliseconds to seconds
            const currentTime = Date.now() / 1000
            const expiryTime = new Date(tokenExpiryTime).getTime()
            if (currentTime > expiryTime) {
              const refreshTokenExpiryTime = JwtService.getRefreshTokenExpiryTime()
              const refreshToken = JwtService.getRefreshToken()
              if (refreshTokenExpiryTime && refreshToken) {
                const currentTime = Date.now()
                const expiryTime = new Date(refreshTokenExpiryTime).getTime()
                if (currentTime < expiryTime) {
                  const store = useAuthStore()
                  const token = await store.refreshToken()
                  config.headers.Authorization = `Bearer ${token}`
                }
              }
            }
          }
        }
        return config
      },
      function (error) {
        return Promise.reject(error)
      },
    )

    this.axios.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (
          error.response.status === 401 &&
          error.response.data.exception != 'Authentication Failed, Invalid Email or Password.'
        ) {
          JwtService.destroyToken()
          JwtService.destroyUser()
          const { init } = useToast()
          init({ message: 'Session expired, please login again', color: 'danger' })
          router.push({ name: 'login' })
        }
        return Promise.reject(error)
      },
    )
  }

  async auth(path: string, data: any) {
    return this.axios.post(path, data)
  }

  getAxiosInstance() {
    return this.axios
  }

  async get(path: string) {
    return this.axios.get(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async post(path: string, data: any) {
    return this.axios.post(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async put(path: string, data: any) {
    return this.axios.put(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async delete(path: string) {
    return this.axios.delete(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async patch(path: string, data: any) {
    return this.axios.patch(path, data, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async head(path: string) {
    return this.axios.head(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async options(path: string) {
    return this.axios.options(path, {
      headers: {
        Authorization: JwtService.getAuthHeader(),
      },
    })
  }

  async request(config: any) {
    return this.axios.request(config)
  }
}

export default new ApiService()
