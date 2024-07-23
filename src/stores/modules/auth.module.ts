import { defineStore } from 'pinia'
import authService from '@services/auth.service'
import jwtService from '@services/jwt.service'
import { ResetPassword } from '@/pages/auth/types'
import { UserDetail } from '@/pages/user/types'

export type User = {
  id: string
  fullName: string
  avatarUrl?: string
  emailaddress: string
  phone: string
  roles: string
  permission?: string[]
}

export const Action = {
  View: 'View',
  Search: 'Search',
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete',
  Export: 'Export',
  Generate: 'Generate',
  Clean: 'Clean',
  UpgradeSubscription: 'UpgradeSubscription',
}

export const Resource = {
  Permission: 'Permission',
  Dashboard: 'Dashboard',
  Hangfire: 'Hangfire',
  Users: 'Users',
  UserRoles: 'UserRoles',
  Roles: 'Roles',
  RoleClaims: 'RoleClaims',
  Clinics: 'Clinics',
  ClinicDetails: 'ClinicDetails',
  DentistDetails: 'DentistDetails',
  DentalRecords: 'DentalRecords',
  FollowUpAppointments: 'FollowUpAppointments',
  MedicalRecords: 'MedicalRecords',
  Prescriptions: 'Prescriptions',
  Appointments: 'Appointments',
  AuditLogs: 'AuditLogs',
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null as User | null,
      isAuthenticated: false,
      avatarUrl: '',
    }
  },
  actions: {
    checkAuth() {
      if (jwtService.getToken()) {
        this.isAuthenticated = true
        const userParse = jwtService.getUser()
        this.user = {
          id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          fullName: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
          avatarUrl: userParse.image_url,
          emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
          roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          permission: userParse.permission,
        }
        this.avatarUrl = userParse.image_url
      } else {
        this.isAuthenticated = false
        this.user = null
      }
    },
    setUserDetails(userDetail: UserDetail) {
      this.avatarUrl = userDetail.imageUrl || ''
    },
    async login(email: string, password: string, captchaToken: string): Promise<any> {
      return authService
        .login(email, password, captchaToken)
        .then((response) => {
          if (response.data.message.token.accessToken) {
            this.isAuthenticated = true
            const userParse = jwtService.parseToken(response.data.message.token.accessToken)
            this.user = {
              id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
              fullName: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
              avatarUrl: userParse.image_url,
              emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
              phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
              roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
              permission: userParse.permission,
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
      captchaToken: string,
    ): Promise<any> {
      return authService
        .register(fullName, email, password, confirmPassword, phoneNumber, captchaToken)
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
    async forgotPassword(email: string, captchaToken: string): Promise<any> {
      try {
        const response = await authService.forgotPassword(email, captchaToken)
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
          const userParse = jwtService.parseToken(response.data.message.token.accessToken)
          this.user = {
            id: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            fullName: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            avatarUrl: userParse.image_url,
            emailaddress: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            phone: userParse['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
            roles: userParse['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          }
          return response.data.message.token.accessToken
        })
        .catch(() => {
          this.isAuthenticated = false
          this.user = null
          jwtService.destroyToken()
          jwtService.destroyUser()
          return ''
        })
    },
    mustHavePermission(action: string, resource: string): boolean {
      if (!this.user) {
        return false
      }
      if (!this.user.permission) {
        return false
      }
      return this.user.permission.some((p) => p === `Permissions.${resource}.${action}`)
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
    hasAccess(permission: string): boolean {
      const splitPermission = permission.split('.')
      if (splitPermission.length !== 2) {
        return false
      }
      return this.mustHavePermission(splitPermission[1], splitPermission[0])
    },
    updateAvatarUrl(avatarUrl: any): void {
      this.avatarUrl = avatarUrl
    },
  },
})
