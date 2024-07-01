import { ResetPassword } from '@/pages/auth/types'
import apiService from '@services/api.service'
import jwtService from '@services/jwt.service'

class AuthService {
  async refreshToken(): Promise<any> {
    return apiService.axios
      .post('/refresh-token', {
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

  async login(email: string, password: string, captchaToken: string): Promise<any> {
    return apiService
      .auth('/tokens', {
        email,
        password,
        captchaToken,
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
    captchaToken: string,
  ): Promise<any> {
    return apiService
      .auth('/register', {
        fullName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        captchaToken,
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
      .post('/logout', {})
      .then((response) => {
        console.log(response)
        return Promise.resolve()
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async confirmEmail(userId: string, code: string): Promise<any> {
    return apiService.axios
      .get(`/confirm-email?userId=${userId}&token=${code}`)
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async forgotPassword(email: string, captchaToken: string): Promise<any> {
    const queryParams = new URLSearchParams({ email }).toString()
    const url = `/forget-password?${queryParams}`
    return apiService.axios
      .post(url, captchaToken, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        return Promise.resolve(response)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }

  async resetPassword(data: ResetPassword) {
    const queryParams = new URLSearchParams(data).toString()
    const url = `/reset-password?${queryParams}`
    return apiService.axios.post(url).then((response) => {
      return Promise.resolve(response)
    })
  }
}
export default new AuthService()
