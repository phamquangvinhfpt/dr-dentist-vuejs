import { ResetPassword } from '@/pages/auth/types'
import apiService from '@services/api.service'
import jwtService from '@services/jwt.service'

class AuthService {
  async refreshToken(): Promise<any> {
    return apiService
      .post('/Auth/RefreshToken', {
        accessToken: jwtService.getToken(),
        refreshToken: jwtService.getRefreshToken(),
      })
      .then((response) => {
        jwtService.saveToken(response.data.message)
        jwtService.saveUser(jwtService.parseTokenLocal())
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async login(email: string, password: string): Promise<any> {
    return apiService
      .auth('/Auth/Authenticate', {
        email,
        password,
      })
      .then((response) => {
        if (response.data.message) {
          jwtService.saveToken(response.data.message)
          jwtService.saveUser(jwtService.parseTokenLocal())
        }
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    phoneNumber: string,
  ): Promise<any> {
    return apiService
      .auth('/Auth/Register', {
        fullName,
        email,
        password,
        confirmPassword,
        phoneNumber,
      })
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async logout() {
    apiService
      .post('/Auth/Logout', {})
      .then((response) => {
        console.log(response)
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async confirmEmail(userId: string, code: string): Promise<any> {
    return apiService
      .get(`/Auth/ConfirmEmail?userId=${userId}&code=${code}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async forgotPassword(email: string): Promise<any> {
    const queryParams = new URLSearchParams({ email }).toString()
    const url = `/Auth/ForgetPassword?${queryParams}`
    return apiService.axios.post(url).then((response) => {
      return Promise.resolve(response)
    })
  }

  async resetPassword(data: ResetPassword) {
    const queryParams = new URLSearchParams(data).toString()
    const url = `/Auth/ResetPassword?${queryParams}`
    return apiService.axios.post(url).then((response) => {
      return Promise.resolve(response)
    })
  }
}
export default new AuthService()
