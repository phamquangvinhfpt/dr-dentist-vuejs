import { defineStore } from 'pinia'
import authService from '@services/auth.service'
import jwtService from '@services/jwt.service'
import { ResetPassword } from '@/pages/auth/types'

export type User = {
  id: string
  fullName: string
  emailaddress: string
  phone: string
  roles: string
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      isAuthenticated: false,
    }
  },
  actions: {
    checkAuth() {
      if (jwtService.getToken()) {
        this.isAuthenticated = true
        const userParse = jwtService.getUser()
        this.user = {
          id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          fullName: userParse.fullName,
          emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
          roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        }
      } else {
        this.isAuthenticated = false
        this.user = null
      }
    },
    login(email: string, password: string): Promise<any> {
      return authService
        .login(email, password)
        .then((response) => {
          if (response.data.token) {
            this.isAuthenticated = true
            const userParse = jwtService.parseToken(response.data.token)
            this.user = {
              id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
              fullName: userParse.fullName,
              emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
              phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
              roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            }
          } else {
            this.isAuthenticated = false
            this.user = null
          }
          return Promise.resolve(response.data)
        })
        .catch((error) => {
          this.isAuthenticated = false
          this.user = null
          return Promise.reject(error)
        })
    },
    register(
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string,
      phoneNumber: string,
    ): Promise<any> {
      return authService
        .register(fullName, email, password, confirmPassword, phoneNumber)
        .then((response) => {
          return Promise.resolve(response)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    async confirmEmail(userId: string, code: string): Promise<any> {
      try {
        const response = await authService.confirmEmail(userId, code)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async forgotPassword(email: string): Promise<any> {
      try {
        const response = await authService.forgotPassword(email)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async resetPassword(data: ResetPassword): Promise<any> {
      try {
        const response = await authService.resetPassword(data)
        return await Promise.resolve(response)
      } catch (error) {
        return await Promise.reject(error)
      }
    },
    async refreshToken(): Promise<any> {
      return authService
        .refreshToken()
        .then((response) => {
          this.isAuthenticated = true
          const userParse = jwtService.parseToken(response.data.token)
          this.user = {
            id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            fullName: userParse.fullName,
            emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
            roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          }
          return response.data.token
        })
        .catch(() => {
          this.isAuthenticated = false
          this.user = null
          jwtService.destroyToken()
          jwtService.destroyUser()
          return ''
        })
    },
    logout() {
      authService.logout()
      this.isAuthenticated = false
      this.user = null
      jwtService.destroyToken()
      jwtService.destroyUser()
    },
    musHaveRole(role: string): boolean {
      if (!this.user) {
        return false
      }
      const roles = this.user.roles.split(',')
      return roles.some((r) => r === role)
    },
  },
})
